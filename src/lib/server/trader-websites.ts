import type { SocialLink } from './schema.ts';

// Verified personal websites or clearly labeled affiliated organizations.
export const traderWebsites: Record<string, SocialLink> = {
  "mark-minervini": {
    "platform": "Website",
    "url": "https://www.minervini.com/"
  },
  "john-carter": {
    "platform": "Simpler Trading · profile",
    "url": "https://www.simplertrading.com/traders/john-carter"
  },
  "george-soros": {
    "platform": "Personal website",
    "url": "https://www.georgesoros.com/"
  },
  "warren-buffett": {
    "platform": "Berkshire Hathaway · company",
    "url": "https://www.berkshirehathaway.com/"
  },
  "paul-tudor-jones": {
    "platform": "Tudor Group · company",
    "url": "https://www.tudor.com/"
  },
  "ray-dalio": {
    "platform": "Principles by Ray Dalio",
    "url": "https://www.principles.com/"
  },
  "peter-lynch": {
    "platform": "Lynch Foundation · biography",
    "url": "https://lynchfoundation.org/who-we-are"
  },
  "jim-simons": {
    "platform": "Simons Foundation · biography",
    "url": "https://www.simonsfoundation.org/news/remembering-the-life-and-careers-of-jim-simons/"
  },
  "carl-icahn": {
    "platform": "Icahn Enterprises · biography",
    "url": "https://ielp.gcs-web.com/board-directors/carl-icahn"
  },
  "benjamin-graham": {
    "platform": "Columbia Business School · legacy",
    "url": "https://business.columbia.edu/heilbrunn/about/valueinvestinghistory"
  },
  "william-oneil": {
    "platform": "William O’Neil + Company · biography",
    "url": "https://www.williamoneil.com/about-us/our-team/bios/founder"
  },
  "linda-raschke": {
    "platform": "Personal website",
    "url": "https://lindaraschke.net/"
  },
  "ed-seykota": {
    "platform": "Personal website",
    "url": "https://www.seykota.com/"
  },
  "michael-steinhardt": {
    "platform": "Steinhardt Foundation · biography",
    "url": "https://steinhardtfoundation.org/michael-steinhardt/"
  },
  "julian-robertson": {
    "platform": "Robertson Foundation",
    "url": "https://www.robertsonfoundation.org/"
  },
  "david-tepper": {
    "platform": "Carolina Panthers · biography",
    "url": "https://www.panthers.com/team/ownership_business/david-a-tepper"
  },
  "ken-griffin": {
    "platform": "Citadel · biography",
    "url": "https://www.citadel.com/who-we-are/leadership/kenneth-c-griffin/"
  },
  "steve-cohen": {
    "platform": "Point72 · biography",
    "url": "https://point72.com/leader/steven-a-cohen/"
  },
  "larry-williams": {
    "platform": "Personal website",
    "url": "https://www.ireallytrade.com/"
  },
  "victor-sperandeo": {
    "platform": "Personal website",
    "url": "https://www.victorsperandeo.com/"
  },
  "bill-lipschutz": {
    "platform": "Hathersage · biography",
    "url": "https://www.hathersage.com/hathersage/wlipschutz.html"
  },
  "jim-rogers": {
    "platform": "Personal website",
    "url": "https://www.jimrogers.com/"
  },
  "john-paulson": {
    "platform": "Paulson & Co. · company",
    "url": "https://paulsonco.com/"
  },
  "bruce-kovner": {
    "platform": "Personal website",
    "url": "https://brucekovner.com/"
  },
  "nick-leeson": {
    "platform": "Personal website",
    "url": "https://www.nickleeson.com/"
  },
  "bill-gross": {
    "platform": "Personal website",
    "url": "https://williamhgross.com/"
  },
  "joe-lewis": {
    "platform": "Tavistock Group · company",
    "url": "https://www.tavistock.com/"
  },
  "peter-schiff": {
    "platform": "Euro Pacific · company",
    "url": "https://europac.com/"
  },
  "simon-cawkwell": {
    "platform": "Evil Takes Stock · website",
    "url": "https://www.eviltakesstock.com/"
  },
  "t-boone-pickens": {
    "platform": "T. Boone Pickens Foundation",
    "url": "https://tboonepickensfoundation.org/"
  },
  "john-templeton": {
    "platform": "John Templeton Foundation · biography",
    "url": "https://www.templeton.org/about/sir-john-templeton"
  },
  "philip-fisher": {
    "platform": "Fisher Investments · author books",
    "url": "https://www.fisherinvestments.com/en-us/resource-library/investing-books/philip-fisher"
  },
  "seth-klarman": {
    "platform": "Baupost Group · biography",
    "url": "https://www.baupost.com/Team/Seth-A-Klarman"
  },
  "howard-marks": {
    "platform": "Oaktree Capital · biography",
    "url": "https://www.oaktreecapital.com/about/leadership/bio/howard-marks"
  },
  "joel-greenblatt": {
    "platform": "Gotham Asset Management · biography",
    "url": "https://gotham.com/"
  },
  "david-einhorn": {
    "platform": "Einhorn Collaborative · biography",
    "url": "https://einhorncollaborative.org/about-us/david-einhorn/"
  },
  "bill-ackman": {
    "platform": "Pershing Square · biography",
    "url": "https://www.pershingsquareinc.com/team/bill-ackman/"
  },
  "dan-loeb": {
    "platform": "Third Point Ventures · biography",
    "url": "https://www.thirdpointventures.com/team/daniel-loeb/"
  },
  "mohnish-pabrai": {
    "platform": "Pabrai Investment Funds · biography",
    "url": "https://pabraifunds.com/management/"
  },
  "charlie-munger": {
    "platform": "Berkshire Hathaway · tribute",
    "url": "https://www.berkshirehathaway.com/2023ar/2023ar.pdf"
  }
};

// Discard only specific obsolete or unrelated seed links; preserve all other editor-supplied links.
const obsoleteLinks: Record<string, string[]> = {
  'stanley-druckenmiller': ['duquesne.com'],
  'paul-tudor-jones': ['tudorinvestmentcorp.com'],
  'linda-raschke': ['lbrgroup.com']
};

function key(value: string): string {
  try {
    const url = new URL(value);
    return `${url.hostname.toLowerCase().replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`;
  } catch {
    return value;
  }
}

export function traderLinks(slug: string, existing: SocialLink[] | null | undefined): SocialLink[] | null {
  // Billy's existing links are explicitly outside the scope of this audit.
  if (slug === 'billy-ribeiro') return existing ?? null;
  const blocked = obsoleteLinks[slug] ?? [];
  const links = (existing ?? []).filter((link) => {
    try {
      return !blocked.includes(new URL(link.url).hostname.toLowerCase().replace(/^www\./, ''));
    } catch {
      return true;
    }
  });
  const website = traderWebsites[slug];
  if (website && !links.some((link) => key(link.url) === key(website.url))) links.push(website);
  return links.length ? links : null;
}
