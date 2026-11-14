import { seedTraders } from './seed.ts';

export const portraitCredits: Record<string, { url: string; source: string; artist: string; license: string }> = {
  "benjamin-graham": {
    "url": "/images/traders/benjamin-graham.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Benjamin_Graham_(1894-1976)_portrait_on_23_March_1950.jpg",
    "artist": "AnonymousUnknown author",
    "license": "Public domain"
  },
  "bill-ackman": {
    "url": "/images/traders/bill-ackman.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Valeant_Pharmaceuticals%27_Business_Model_(headshot).jpg",
    "artist": "Senate Democrats",
    "license": "CC BY 2.0"
  },
  "carl-icahn": {
    "url": "/images/traders/carl-icahn.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Carl_Icahn,_1980s.jpg",
    "artist": "AviateHistory",
    "license": "CC0"
  },
  "charlie-munger": {
    "url": "/images/traders/charlie-munger.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Charlie_Munger_(cropped).jpg",
    "artist": "Nick",
    "license": "CC BY 2.0"
  },
  "david-tepper": {
    "url": "/images/traders/david-tepper.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:David_Tepper_01.jpg",
    "artist": "Appaloosa Management",
    "license": "CC BY-SA 3.0"
  },
  "george-soros": {
    "url": "/images/traders/george-soros.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:George_Soros,_Founder_and_Chairman_of_the_Open_Society_Foundations,_visits_the_EC_(3x4_cropped).jpg",
    "artist": "Aris Oikonomou / European Commission",
    "license": "CC BY 4.0"
  },
  "howard-marks": {
    "url": "/images/traders/howard-marks.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Howard_Marks_2.17.12_(cropped).jpg",
    "artist": "kellywritershouse",
    "license": "CC BY 2.0"
  },
  "jesse-livermore": {
    "url": "/images/traders/jesse-livermore.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Press_photo_of_Jesse_Livermore_in_1940_(cropped).jpg",
    "artist": "Acme Photo",
    "license": "Public domain"
  },
  "jim-rogers": {
    "url": "/images/traders/jim-rogers.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Jim-rogers-madrid-160610.jpg",
    "artist": "FDV",
    "license": "CC BY-SA 3.0"
  },
  "jim-simons": {
    "url": "/images/traders/jim-simons.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Jim_Simons_at_MSRI.jpg",
    "artist": "Gleuschk",
    "license": "CC BY-SA 3.0"
  },
  "john-neff": {
    "url": "/images/traders/john-neff.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:John_neff_mutual_fund_manager.jpg",
    "artist": "BillCramer",
    "license": "CC BY-SA 4.0"
  },
  "ken-griffin": {
    "url": "/images/traders/ken-griffin.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Kenneth_C._Griffin.jpg",
    "artist": "Paul Elledge",
    "license": "CC BY-SA 4.0"
  },
  "larry-williams": {
    "url": "/images/traders/larry-williams.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Larry_Williams_at_Mets_Stadium.jpg",
    "artist": "JetSetJeri2",
    "license": "CC BY-SA 4.0"
  },
  "peter-schiff": {
    "url": "/images/traders/peter-schiff.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Peter_Schiff_by_Gage_Skidmore_3.jpg",
    "artist": "Gage Skidmore",
    "license": "CC BY-SA 3.0"
  },
  "ray-dalio": {
    "url": "/images/traders/ray-dalio.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Web_Summit_2018_-_Forum_-_Day_2,_November_7_HM1_7481_(44858045925).jpg",
    "artist": "Web Summit",
    "license": "CC BY 2.0"
  },
  "seth-klarman": {
    "url": "/images/traders/seth-klarman.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Seth_Klarman_at_147th_Preakness_Stakes.jpg",
    "artist": "Maryland GovPics",
    "license": "CC BY 2.0"
  },
  "steve-cohen": {
    "url": "/images/traders/steve-cohen.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:Steve_baseball_4_(1)_(cropped).jpg",
    "artist": "Michael Seib",
    "license": "CC BY-SA 4.0"
  },
  "t-boone-pickens": {
    "url": "/images/traders/t-boone-pickens.jpg",
    "source": "https://commons.wikimedia.org/wiki/File:T._Boone_Pickens_discusses_the_impact_of_shale_natural_gas_on_the_American_economy_at_the_Hudson_Institute_on_6_April_2016_-_25_(cropped).jpg",
    "artist": "Hudson Institute",
    "license": "CC BY 2.0"
  }
};

const seedPhotos = new Map(seedTraders.map((trader) => [trader.slug, trader.photoUrl]));

export function traderPhoto(slug: string, photoUrl: string | null | undefined): string | null {
	return photoUrl || seedPhotos.get(slug) || null;
}
