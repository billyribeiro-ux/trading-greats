import { seedTraders } from "./seed.ts";

export const portraitCredits: Record<
  string,
  { url: string; source: string; artist: string; license: string }
> = {
  "andy-krieger": {
    url: "https://tw.mitrade.com/cms_uploads/uedimg/20230711/1689043192711.jpg",
    source: "https://www.mitrade.com/th/insights/forex/basics/top-forex-traders",
    artist: "Mitrade",
    license: "Source website",
  },
  "walter-schloss": {
    url: "https://files.sunoresearch.com.br/p/uploads/2018/08/walter-j-schloss-4.jpg",
    source: "https://www.suno.com.br/tudo-sobre/walter-schloss/",
    artist: "Suno",
    license: "Source website",
  },
  "stanley-druckenmiller": {
    url: "https://www.grantspub.com/images/speakers/Druckenmiller.jpg",
    source: "https://www.grantspub.com/includes/cfn_speakerBio.cfm?sid=155",
    artist: "Grant's Interest Rate Observer",
    license: "Source website",
  },
  "peter-lynch": {
    url: "https://cf-images.us-east-1.prod.boltdns.net/v1/static/854081161001/5ed7be5e-b861-42ec-b85f-1a0b6e9edec8/d8d1249c-6682-4683-b9ee-73426691559c/1280x720/match/image.jpg",
    source: "https://www.foxbusiness.com/video/6117461044001",
    artist: "Fox Business",
    license: "Source website",
  },
  "ed-seykota": {
    url: "https://img.etimg.com/thumb/width-1600,height-900,imgsize-1065171,resizemode-75,msid-87815893/markets/stocks/news/timeless-trading-lessons-from-reclusive-market-wizard-ed-seykota.jpg",
    source:
      "https://m.economictimes.com/markets/stocks/news/timeless-trading-lessons-from-reclusive-market-wizard-ed-seykota/articleshow/87815893.cms",
    artist: "The Economic Times",
    license: "Source website",
  },
  "richard-dennis": {
    url: "https://prod-asset-ch3awt.traderknows.com/images/2799eb081592462d9c94d66dfb7eda9a.width-500.jpg",
    source: "https://www.traderknows.com/en/news/c352fab7e54c41018c48937df43fa4d5",
    artist: "TraderKnows",
    license: "Source website",
  },
  "michael-steinhardt": {
    url: "https://files.sunoresearch.com.br/p/uploads/2019/11/michael-steinhardt.jpg",
    source:
      "https://www.suno.com.br/artigos/michael-steinhardt-e-o-circulo-de-competencia-parte-i/",
    artist: "Suno",
    license: "Source website",
  },
  "julian-robertson": {
    url: "https://images.wsj.net/im-609309/social",
    source:
      "https://www.wsj.com/finance/investing/hedge-fund-pioneer-julian-robertson-has-died-at-90-11661273726",
    artist: "The Wall Street Journal",
    license: "Source website",
  },
  "nicolas-darvas": {
    url: "https://1.bp.blogspot.com/-sNCRhX2h6Ks/X6L1JxFfv7I/AAAAAAAAjwM/n_4Q3eKffg0AmUZZXUc6Pb52swI3fDvpgCLcBGAsYHQ/w1200-h630-p-k-no-nu/1.jpg",
    source: "https://www.tradelikeamonk.com/2020/03/how-to-trade-like-nicolas-darvas.html",
    artist: "Trade Like a Monk",
    license: "Source website",
  },
  "john-paulson": {
    url: "https://image.cnbcfm.com/api/v1/image/28816362-paulson_john.jpg?h=405&v=1354732729&w=720",
    source: "https://www.cnbc.com/2009/01/23/the-man-who-made-too-much.html",
    artist: "CNBC",
    license: "Source website",
  },
  "michael-marcus": {
    url: "https://miro.medium.com/v2/resize:fit:988/1*Mb7enlOxXo_ViwMKtUyAtw.png",
    source:
      "https://medium.com/@cptmarketsofficial/the-worlds-top-10-traders-2-michael-marcos-1c1c254bc228",
    artist: "CPT Markets / Medium",
    license: "Source website",
  },
  "bill-gross": {
    url: "https://s.wsj.net/public/resources/images/ON-AZ888_BillGr_KS_20130129134900.jpg",
    source: "https://www.wsj.com/articles/SB50001424052748704235404578400403211867018",
    artist: "The Wall Street Journal",
    license: "Source website",
  },
  "joe-lewis": {
    url: "https://www.suno.com.br/wp-content/uploads/2019/05/joe-lewis1.jpg",
    source: "https://www.suno.com.br/tudo-sobre/joe-lewis/",
    artist: "Suno",
    license: "Source website",
  },
  "michael-burry": {
    url: "https://imageio.forbes.com/specials-images/dam/imageserve/38497369/0x0.jpg?format=jpg&width=1200",
    source:
      "https://www.forbes.com/sites/gurufocus/2019/07/31/dr-michael-burry-of-big-short-likes-asian-stocks/",
    artist: "Forbes",
    license: "Source website",
  },
  "philip-fisher": {
    url: "https://i0.wp.com/investidoremvalor.com/wp-content/uploads/2022/01/philip-fisher-04.jpg?resize=760%2C570&ssl=1",
    source: "https://investidoremvalor.com/personalidades/philip-fisher/",
    artist: "Investidor em Valor",
    license: "Source website",
  },
  "joel-greenblatt": {
    url: "https://images.squarespace-cdn.com/content/v1/65d4bd883a496c3da7bbd799/25b33a5b-1b68-4fcb-9bb4-dbb7027bc688/Joel_Greenblatt-1.jpg",
    source:
      "https://www.jvpvm.de/blog/joel-greenblatt-der-meister-des-value-investings-und-seine-einzigartige-erfolgsstrategie",
    artist: "JVPVM",
    license: "Source website",
  },
  "david-einhorn": {
    url: "https://image.cnbcfm.com/api/v1/image/102624319-748530a75baa43f0d85c49ec6a7957e464bed438.jpg?h=1080&v=1529468317&w=1920",
    source:
      "https://www.cnbc.com/video/2015/04/27/david-einhorn-reflects-on-allied-capital-speech.html",
    artist: "CNBC",
    license: "Source website",
  },
  "dan-loeb": {
    url: "https://img2.storyblok.com/768x835/f/124960/3047x1827/b8a4d86887/dan-loeb-1.jpg",
    source: "https://www.thirdpointventures.com/team/daniel-loeb/",
    artist: "Third Point Ventures",
    license: "Source website",
  },
  "mohnish-pabrai": {
    url: "https://cdn.prod.website-files.com/6913ba09c594c4cd77f9d47f/691c3c499915d5878e9e12f0_20251009-mp-profile-picture-vf_orig.jpg",
    source: "https://www.chaiwithpabrai.com/",
    artist: "Chai with Pabrai",
    license: "Source website",
  },
  "simon-cawkwell": {
    url: "https://static.standard.co.uk/s3fs-public/thumbnails/image/2014/07/28/13/Standard13.jpg?width=1200",
    source:
      "https://www.standard.co.uk/business/cityspy/city-spy-evil-knievel-pulls-off-another-big-punt-9633308.html",
    artist: "The Standard",
    license: "Source website",
  },
  "mark-minervini": {
    url: "https://cdn.prod.website-files.com/685b82c3380282133dbbe345/68bedf2d775752ddd14b4257_Screenshot_1090.png",
    source: "https://minerviniprivateaccess.com/about-mark",
    artist: "Minervini Private Access",
    license: "Source website",
  },
  "john-carter": {
    url: "https://cdn.simplertrading.com/2025/06/20091523/Circle-720x720_JohnCarter.png",
    source: "https://www.simplertrading.com/courses/explosive",
    artist: "Simpler Trading",
    license: "Source website",
  },
  "linda-raschke": {
    url: "https://i0.wp.com/jgo.zef.mybluehost.me/website_62e097df/wp-content/uploads/2026/01/linda-image.jpg?resize=1080%2C675&ssl=1",
    source: "https://lindaraschke.net/",
    artist: "Linda Bradford Raschke",
    license: "Source website",
  },
  "william-oneil": {
    url: "https://cdn.prod.website-files.com/68e3e66b6f19f8a55f6dddee/68edabd93490d8b818847ee1_william_oneil_bio.png",
    source: "https://www.williamoneil.com/about-us/our-team/bios/founder",
    artist: "William O’Neil + Company",
    license: "Source website",
  },
  "john-templeton": {
    url: "https://www.templeton.org/wp-content/uploads/2017/01/Sir-John-3-1.jpg",
    source: "https://www.templeton.org/about/sir-john-templeton",
    artist: "John Templeton Foundation",
    license: "Source website",
  },
  "bruce-kovner": {
    url: "https://www.brucekovner.com/BruceKovnerHeadshot.jpg",
    source: "https://www.brucekovner.com/",
    artist: "Rosalie O’Connor / Bruce Kovner",
    license: "Source website",
  },
  "nick-leeson": {
    url: "https://www.nickleeson.com/wp-content/uploads/2017/01/nick-1-1.jpg",
    source: "https://www.nickleeson.com/",
    artist: "Nick Leeson",
    license: "Source website",
  },
  "victor-sperandeo": {
    url: "https://static.wixstatic.com/media/98a14b_cdc5e9fb0fcd432e90b687940b075179~mv2_d_1327_1531_s_2.jpg",
    source: "https://www.victorsperandeo.com/",
    artist: "Victor Sperandeo",
    license: "Source website",
  },
  "bill-lipschutz": {
    url: "https://www.hathersage.com/hathersage/images/wlipschutz.jpg",
    source: "https://www.hathersage.com/hathersage/wlipschutz.html",
    artist: "Hathersage",
    license: "Source website",
  },

  "benjamin-graham": {
    url: "/images/traders/benjamin-graham.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Benjamin_Graham_(1894-1976)_portrait_on_23_March_1950.jpg",
    artist: "AnonymousUnknown author",
    license: "Public domain",
  },
  "bill-ackman": {
    url: "/images/traders/bill-ackman.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Valeant_Pharmaceuticals%27_Business_Model_(headshot).jpg",
    artist: "Senate Democrats",
    license: "CC BY 2.0",
  },
  "carl-icahn": {
    url: "/images/traders/carl-icahn.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Carl_Icahn,_1980s.jpg",
    artist: "AviateHistory",
    license: "CC0",
  },
  "charlie-munger": {
    url: "/images/traders/charlie-munger.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Charlie_Munger_(cropped).jpg",
    artist: "Nick",
    license: "CC BY 2.0",
  },
  "david-tepper": {
    url: "/images/traders/david-tepper.jpg",
    source: "https://commons.wikimedia.org/wiki/File:David_Tepper_01.jpg",
    artist: "Appaloosa Management",
    license: "CC BY-SA 3.0",
  },
  "george-soros": {
    url: "/images/traders/george-soros.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:George_Soros,_Founder_and_Chairman_of_the_Open_Society_Foundations,_visits_the_EC_(3x4_cropped).jpg",
    artist: "Aris Oikonomou / European Commission",
    license: "CC BY 4.0",
  },
  "howard-marks": {
    url: "/images/traders/howard-marks.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Howard_Marks_2.17.12_(cropped).jpg",
    artist: "kellywritershouse",
    license: "CC BY 2.0",
  },
  "jesse-livermore": {
    url: "/images/traders/jesse-livermore.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Press_photo_of_Jesse_Livermore_in_1940_(cropped).jpg",
    artist: "Acme Photo",
    license: "Public domain",
  },
  "jim-rogers": {
    url: "/images/traders/jim-rogers.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Jim-rogers-madrid-160610.jpg",
    artist: "FDV",
    license: "CC BY-SA 3.0",
  },
  "jim-simons": {
    url: "/images/traders/jim-simons.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Jim_Simons_at_MSRI.jpg",
    artist: "Gleuschk",
    license: "CC BY-SA 3.0",
  },
  "john-neff": {
    url: "/images/traders/john-neff.jpg",
    source: "https://commons.wikimedia.org/wiki/File:John_neff_mutual_fund_manager.jpg",
    artist: "BillCramer",
    license: "CC BY-SA 4.0",
  },
  "ken-griffin": {
    url: "/images/traders/ken-griffin.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Kenneth_C._Griffin.jpg",
    artist: "Paul Elledge",
    license: "CC BY-SA 4.0",
  },
  "larry-williams": {
    url: "/images/traders/larry-williams.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Larry_Williams_at_Mets_Stadium.jpg",
    artist: "JetSetJeri2",
    license: "CC BY-SA 4.0",
  },
  "peter-schiff": {
    url: "/images/traders/peter-schiff.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Peter_Schiff_by_Gage_Skidmore_3.jpg",
    artist: "Gage Skidmore",
    license: "CC BY-SA 3.0",
  },
  "ray-dalio": {
    url: "/images/traders/ray-dalio.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:Web_Summit_2018_-_Forum_-_Day_2,_November_7_HM1_7481_(44858045925).jpg",
    artist: "Web Summit",
    license: "CC BY 2.0",
  },
  "seth-klarman": {
    url: "/images/traders/seth-klarman.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Seth_Klarman_at_147th_Preakness_Stakes.jpg",
    artist: "Maryland GovPics",
    license: "CC BY 2.0",
  },
  "steve-cohen": {
    url: "/images/traders/steve-cohen.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Steve_baseball_4_(1)_(cropped).jpg",
    artist: "Michael Seib",
    license: "CC BY-SA 4.0",
  },
  "t-boone-pickens": {
    url: "/images/traders/t-boone-pickens.jpg",
    source:
      "https://commons.wikimedia.org/wiki/File:T._Boone_Pickens_discusses_the_impact_of_shale_natural_gas_on_the_American_economy_at_the_Hudson_Institute_on_6_April_2016_-_25_(cropped).jpg",
    artist: "Hudson Institute",
    license: "CC BY 2.0",
  },
};

const seedPhotos = new Map(seedTraders.map((trader) => [trader.slug, trader.photoUrl]));

export function traderPhoto(slug: string, photoUrl: string | null | undefined): string | null {
  return photoUrl || seedPhotos.get(slug) || null;
}
