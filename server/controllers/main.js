import passport from 'passport';
import  { models, common } from '../db';

const { 
  User,
  Company, 
  companyAutoComplete, 
  Project, 
  projectAutoComplete,
  Portfolio,
  Metadata,
  Misc,
  Image,
  Count
} = models;

let mainContents = null;

function getContents(model, query, sort, limit, loaded, populate) {
  const sorting = sort === 'popular'? {score:-1} : {created:-1};
  return model
      .find(query)
      .populate(populate)
      .sort(sorting)
      .skip(loaded)
      .limit(limit)
      .lean();
}

function getUserContents({sort='popular', loaded=0, limit=6}) {
  return getContents(User, {'portfolios.0': {$exists:true}}, sort, limit, loaded, []);
}

function getProjectContents({sort='popular', loaded=0, limit=6}) {
  return getContents(Project, {'portfolios.0': {$exists:true}}, sort, limit, loaded, ['portfolios.images']);
}

function getCompanyContents({sort='popular', loaded=0, limit=6}) {
  return getContents(Company, {'companyPortfolios.0': {$exists:true}}, sort, limit, loaded, []);
}

function getMakerPorfolioContents({sort='popular', loaded=0, limit=18}) {
  return getContents(Portfolio, {type:'maker'}, sort, limit, loaded, ['user', 'company', 'portfolios.images']);
}

function getCompanyPorfolioContents({sort='popular', loaded=0, limit=9}) {
  return getContents(Portfolio, {type:'company'}, sort, limit, loaded, ['user', 'company', 'portfolios.images']);
}

export async function buildContents(req, res) {
  console.log('build main contents...', new Date().toISOString());
  const loadings = [
    getUserContents({}),
    getProjectContents({}),
    getCompanyContents({}),
    getMakerPorfolioContents({}),
    getCompanyPorfolioContents({}),
    getMakerPorfolioContents({sort:'recent', limit:12}),
    getCompanyPorfolioContents({sort:'recent', limit:6})
  ];
  const [users, projects, companies, portfolios, companyPortfolios, portfoliosRecent, companyPortfoliosRecent] = await Promise.all(loadings);
  mainContents = { users, projects, companies, portfolios, companyPortfolios, portfoliosRecent, companyPortfoliosRecent };
  if(req && res) {
    res.json(mainContents);
  }
}

export async function main(req, res) {
  if(!mainContents)
    await buildContents();
  return res.json(mainContents);
}

export async function more(req, res) {
  const params = req.params;
  const loaded = Number.parseInt(params.loaded || 0);
  const { topic, subtype } = params;

  if(topic === 'project') {
    const result = await getProjectContents({ loaded });
    return res.json({ result, title:'프로젝트 들여다보기', topic, subtype });
  }

  if(topic === 'portfolio') {    
    const sort = params.sort;
    const loader = subtype.startsWith('company')? getCompanyPorfolioContents : getMakerPorfolioContents;
    const result = await loader({ sort, limit:12, loaded });
    const prefix = (sort === 'popular')? '인기 ' : '새로 등록된 ';
    return res.json({ result, title: prefix + ((subtype === 'company')? '수행실적' : '포트폴리오'), topic, subtype: subtype + sort });
  }

  if(topic === 'company') {
    const result = await getCompanyContents({ loaded });
    return res.json({ result, title:'주목할만한 기업들', topic, subtype });
  }

  if(topic === 'maker') {
    const result = await getUserContents({ loaded });
    return res.json({ result, title:'주목할만한 메이커들', topic, subtype });
  }
  return res.json({});
}

export async function command(req, res) {
  const command = req.params.command;

  if(command === 'build-main-contents') {
    await buildContents();
  }
  else {
    await common.runCommand(command);
  }

  return res.json({result: 'ok'});
}

export async function increaseCount(req, res) {
  const { content, identifier } = req.body;
  const userid = req.user && req.user.userid? req.user.userid : 'unknown';

  await Count.inc(content, identifier, userid);
  return res.json({result: 'ok'});
}

export async function search(req, res) {
  const keyword = common.cut(req.params.keyword).join(' ');
  
  const portfolios = await Portfolio
                            .find( { $text: { $search: keyword } }, {score: { $meta: "textScore" }} )
                            .sort( { score: { $meta: "textScore" } } )
                            .limit(100)
                            .populate(['company', 'user'])
                            .lean();
  
  res.json({ result: { portfolios } });
}

export default {
  main,
  more,
  command,
  search,
  increaseCount
};
