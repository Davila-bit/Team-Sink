import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables FIRST
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const resources = [
  {
    "name": "Feeding America",
    "description": "Feeding America is a national network of food banks that sources and distributes food to local partners serving low-income individuals and families across the United States. Through partnerships with pantries, meal sites, and mobile distributions, it helps working households facing hunger stretch tight budgets.",
    "type": "food",
    "location": "161 N Clark St, Suite 700, Chicago, IL 60601",
    "contact": "(800) 771-2303",
    "website": "https://www.feedingamerica.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["60601", "60602", "60603"]
    }
  },
  {
    "name": "Food Bank For New York City",
    "description": "Food Bank For New York City operates warehouses, community kitchens, and pantries to provide free groceries and meals to low-income New Yorkers in all five boroughs. It also offers SNAP enrollment assistance and nutrition education to help working families make ends meet.",
    "type": "food",
    "location": "39 Broadway, 10th Floor, New York, NY 10006",
    "contact": "(212) 566-7855",
    "website": "https://www.foodbanknyc.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["10006", "10002", "11201"]
    }
  },
  {
    "name": "City Harvest",
    "description": "City Harvest is a New York City food rescue organization that collects surplus food and delivers it to a network of community food programs. Its Mobile Markets and pantry partners serve working low-income households throughout the five boroughs.",
    "type": "food",
    "location": "150 52nd St, Brooklyn, NY 11232",
    "contact": "(646) 412-0600",
    "website": "https://www.cityharvest.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["11232", "11201", "10002"]
    }
  },
  {
    "name": "Los Angeles Regional Food Bank",
    "description": "The Los Angeles Regional Food Bank distributes nutritious food through hundreds of partner agencies and direct distributions across Los Angeles County. It supports low-income and ALICE households with groceries, produce, and prepared meals.",
    "type": "food",
    "location": "1734 E 41st St, Los Angeles, CA 90058",
    "contact": "(323) 234-3030",
    "website": "https://www.lafoodbank.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["90058", "90011", "90001"]
    }
  },
  {
    "name": "Greater Chicago Food Depository",
    "description": "The Greater Chicago Food Depository is Cook County's food bank, supplying pantries, shelters, and meal programs with food for residents experiencing hunger. It also runs mobile distributions and benefits outreach to help working families access SNAP and other supports.",
    "type": "food",
    "location": "4100 W Ann Lurie Pl, Chicago, IL 60632",
    "contact": "(773) 247-3663",
    "website": "https://www.chicagosfoodbank.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["60632", "60623", "60629"]
    }
  },
  {
    "name": "Houston Food Bank",
    "description": "Houston Food Bank provides food assistance throughout southeast Texas through a network of partner agencies, mobile pantries, and Kids Cafe sites. The organization prioritizes families with low and moderate incomes who are struggling to afford groceries.",
    "type": "food",
    "location": "535 Portwall St, Houston, TX 77029",
    "contact": "(713) 223-3700",
    "website": "https://www.houstonfoodbank.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["77029", "77020", "77009"]
    }
  },
  {
    "name": "Central Texas Food Bank",
    "description": "Central Texas Food Bank serves Austin and surrounding counties with food pantries, mobile distributions, and child nutrition programs. It helps low-income working families keep food on the table while they manage rent, child care, and other basic expenses.",
    "type": "food",
    "location": "6500 Metropolis Dr, Austin, TX 78744",
    "contact": "(512) 282-2111",
    "website": "https://www.centraltexasfoodbank.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["78744", "78741", "78702"]
    }
  },
  {
    "name": "Feeding South Florida",
    "description": "Feeding South Florida is the Feeding America food bank serving Palm Beach, Broward, Miami-Dade, and Monroe Counties. It operates pantries, mobile distributions, and benefits outreach for ALICE and low-income households facing food insecurity.",
    "type": "food",
    "location": "2501 SW 32nd Terrace, Pembroke Park, FL 33023",
    "contact": "(954) 518-1818",
    "website": "https://www.feedingsouthflorida.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["33023", "33169", "33311"]
    }
  },
  {
    "name": "Philabundance",
    "description": "Philabundance is the leading hunger-relief organization in the Philadelphia region, providing food through pantries, fresh produce markets, and prepared meal programs. It targets individuals and families with low and moderate incomes across nine counties in Pennsylvania and New Jersey.",
    "type": "food",
    "location": "3616 S Galloway St, Philadelphia, PA 19148",
    "contact": "(215) 339-0900",
    "website": "https://www.philabundance.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["19148", "19145", "19146"]
    }
  },
  {
    "name": "St. Mary's Food Bank",
    "description": "St. Mary's Food Bank serves Phoenix and much of Arizona with emergency food boxes, school pantries, and mobile distributions. Working families and individuals with limited assets can receive groceries at no cost through partner agencies and on-site programs.",
    "type": "food",
    "location": "2831 N 31st Ave, Phoenix, AZ 85009",
    "contact": "(602) 242-3663",
    "website": "https://www.stmarysfoodbank.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["85009", "85017", "85035"]
    }
  },
  {
    "name": "Coalition for the Homeless, Inc.",
    "description": "Coalition for the Homeless is a New York City nonprofit that provides crisis services, shelter referral, and permanent housing programs for individuals and families experiencing homelessness. It also offers eviction prevention and advocacy for very low- and low-income New Yorkers.",
    "type": "housing",
    "location": "129 Fulton St, New York, NY 10038",
    "contact": "(212) 776-2000",
    "website": "https://www.coalitionforthehomeless.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["10038", "10002", "10009"]
    }
  },
  {
    "name": "Los Angeles Homeless Services Authority (LAHSA)",
    "description": "LAHSA coordinates Los Angeles County's homeless services system, including outreach, emergency shelter, and rapid rehousing programs. It connects low-income and ALICE households to housing resources, rental assistance, and supportive services.",
    "type": "housing",
    "location": "707 Wilshire Blvd, 10th Floor, Los Angeles, CA 90017",
    "contact": "(213) 683-3333",
    "website": "https://www.lahsa.org",
    "hours": "Mon-Fri 8am-5pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["90017", "90013", "90014"]
    }
  },
  {
    "name": "All Chicago Making Homelessness History",
    "description": "All Chicago manages the city's homeless services continuum, providing rental assistance, shelter coordination, and street outreach. It focuses on helping low-income Chicagoans avoid eviction and quickly regain stable housing after a crisis.",
    "type": "housing",
    "location": "651 W Washington Blvd, Suite 504, Chicago, IL 60661",
    "contact": "(312) 379-0301",
    "website": "https://www.allchicago.org",
    "hours": "Mon-Fri 9am-5pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["60661", "60607", "60608"]
    }
  },
  {
    "name": "Houston Housing Authority",
    "description": "The Houston Housing Authority administers public housing and Housing Choice Voucher (Section 8) programs for the City of Houston. It serves very low-income and low-income households, helping them secure safe and affordable rental housing.",
    "type": "housing",
    "location": "2640 Fountain View Dr, Suite 400, Houston, TX 77057",
    "contact": "(713) 260-0522",
    "website": "https://www.housingforhouston.com",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["77057", "77036", "77063"]
    }
  },
  {
    "name": "Caritas of Austin",
    "description": "Caritas of Austin provides housing-focused case management, rapid rehousing, and permanent supportive housing for people experiencing or at risk of homelessness. It prioritizes very low-income individuals and families in Austin who are working or seeking work but cannot afford stable housing.",
    "type": "housing",
    "location": "611 Neches St, Austin, TX 78701",
    "contact": "(512) 479-4610",
    "website": "https://caritasofaustin.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["78701", "78702", "78703"]
    }
  },
  {
    "name": "Miami-Dade Homeless Trust",
    "description": "The Miami-Dade Homeless Trust oversees the county's homeless continuum of care, funding shelter, outreach, and Housing First programs. It connects low-income and ALICE households facing homelessness with emergency shelter and longer-term housing solutions.",
    "type": "housing",
    "location": "111 NW 1st St, Suite 310, Miami, FL 33128",
    "contact": "(305) 375-1490",
    "website": "https://www.miamidade.gov/global/homeless/home.page",
    "hours": "Mon-Fri 8am-5pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["33128", "33136", "33142"]
    }
  },
  {
    "name": "Project HOME",
    "description": "Project HOME offers street outreach, emergency and transitional housing, and permanent supportive housing for individuals and families experiencing homelessness in Philadelphia. It combines housing with education, employment, and health services for people with very low incomes.",
    "type": "housing",
    "location": "1515 Fairmount Ave, Philadelphia, PA 19130",
    "contact": "(215) 232-7272",
    "website": "https://www.projecthome.org",
    "hours": "Mon-Fri 8am-4pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["19130", "19121", "19132"]
    }
  },
  {
    "name": "UMOM New Day Centers",
    "description": "UMOM New Day Centers provides emergency shelter, transitional housing, and permanent supportive housing for families and single women experiencing homelessness in Phoenix. It helps very low-income households regain stability through housing, employment support, and child care.",
    "type": "housing",
    "location": "3333 E Van Buren St, Phoenix, AZ 85008",
    "contact": "(602) 275-7852",
    "website": "https://umom.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["85008", "85006", "85034"]
    }
  },
  {
    "name": "Callen-Lorde Community Health Center",
    "description": "Callen-Lorde Community Health Center is an LGBTQ-focused federally qualified health center in Manhattan providing primary care, behavioral health, sexual health, and pharmacy services. Care is offered on a sliding fee scale, with special attention to low-income and uninsured New Yorkers.",
    "type": "healthcare",
    "location": "356 W 18th St, New York, NY 10011",
    "contact": "(212) 271-7200",
    "website": "https://callen-lorde.org",
    "hours": "Mon-Thu 8:15am-8:15pm; Fri 9am-4:45pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["10011", "10001", "10014"]
    }
  },
  {
    "name": "Venice Family Clinic",
    "description": "Venice Family Clinic is a community health center in Los Angeles that provides primary care, behavioral health, dental, and specialty services regardless of patients' ability to pay. It offers sliding-scale fees and enrollment help for Medi-Cal and Covered California for low-income families.",
    "type": "healthcare",
    "location": "622 Rose Ave, Venice, CA 90291",
    "contact": "(310) 392-8630",
    "website": "https://venicefamilyclinic.org",
    "hours": "Mon-Thu 7am-6pm; Fri 8am-4pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["90291", "90401", "90066"]
    }
  },
  {
    "name": "Erie Family Health Centers – West Town",
    "description": "Erie Family Health Centers' West Town site in Chicago provides comprehensive primary care, prenatal, pediatric, and behavioral health services. As an FQHC, it uses a sliding fee scale and serves patients with Medicaid, Medicare, commercial insurance, or no insurance.",
    "type": "healthcare",
    "location": "1701 W Superior St, Chicago, IL 60622",
    "contact": "(312) 666-3494",
    "website": "https://www.eriefamilyhealth.org",
    "hours": "Mon, Tue, Thu, Fri 8:30am-5:30pm; Wed 10am-7pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["60622", "60612", "60647"]
    }
  },
  {
    "name": "Legacy Community Health",
    "description": "Legacy Community Health is a large FQHC network in Houston offering primary care, HIV care, behavioral health, pediatrics, and OB/GYN services. It serves low-income and uninsured patients with sliding-scale fees and assistance accessing public coverage programs.",
    "type": "healthcare",
    "location": "6602 Windfield Rd, Houston, TX 77050",
    "contact": "(832) 548-5000",
    "website": "https://www.legacycommunityhealth.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["77050", "77016", "77028"]
    }
  },
  {
    "name": "People's Community Clinic",
    "description": "People's Community Clinic in Austin is a federally qualified health center providing primary care, women's health, pediatrics, behavioral health, and health education. Services are offered on a sliding fee scale to ensure access for uninsured and low-income Central Texans.",
    "type": "healthcare",
    "location": "1101 Camino La Costa, Austin, TX 78752",
    "contact": "(512) 478-4939",
    "website": "https://www.austinpcc.org",
    "hours": "Mon-Thu 8am-5pm (evening hours some days); Fri 8am-5pm; first Sat 7:45am-12pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["78752", "78753", "78758"]
    }
  },
  {
    "name": "Care Resource Community Health Centers – Midtown Miami",
    "description": "Care Resource is an FQHC serving Miami-Dade and Broward Counties with primary care, HIV care, behavioral health, dental, and pharmacy services. Its Midtown Miami site offers sliding-scale fees and accepts Medicaid, Medicare, and most insurance plans for low-income patients.",
    "type": "healthcare",
    "location": "3510 Biscayne Blvd, Miami, FL 33137",
    "contact": "(305) 576-1234",
    "website": "https://careresource.org",
    "hours": "Mon, Tue, Thu, Fri 8am-5:15pm; Wed 8am-7:30pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["33137", "33132", "33138"]
    }
  },
  {
    "name": "Maria de los Santos Health Center (Delaware Valley Community Health)",
    "description": "Maria de los Santos Health Center in North Philadelphia is part of Delaware Valley Community Health and provides primary care, dental, behavioral health, and social services. It focuses on serving low-income and uninsured patients, particularly Latino communities, regardless of ability to pay.",
    "type": "healthcare",
    "location": "401 W Allegheny Ave, Philadelphia, PA 19133",
    "contact": "(215) 291-2500",
    "website": "https://dvch.org/maria-de-los-santos-health-center/",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["19133", "19134", "19140"]
    }
  },
  {
    "name": "Mountain Park Health Center",
    "description": "Mountain Park Health Center is a Phoenix-area FQHC that offers family medicine, pediatrics, OB/GYN, behavioral health, and pharmacy services. It provides culturally competent care on a sliding fee scale for uninsured and underinsured individuals and families.",
    "type": "healthcare",
    "location": "3830 E Van Buren St, Phoenix, AZ 85008",
    "contact": "(602) 243-7277",
    "website": "https://mountainparkhealth.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["85008", "85034", "85006"]
    }
  },
  {
    "name": "Per Scholas",
    "description": "Per Scholas is a national nonprofit training provider offering tuition-free IT and tech career training for adults who are unemployed or underemployed. Its Bronx headquarters runs intensive courses and job placement support targeted to low- and moderate-income learners.",
    "type": "education",
    "location": "804 E 138th St, Bronx, NY 10454",
    "contact": "(718) 991-8400",
    "website": "https://perscholas.org",
    "hours": "Mon-Fri 8am-6pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["10454", "10455", "10451"]
    }
  },
  {
    "name": "Year Up New York | New Jersey – Wall Street Campus",
    "description": "Year Up New York | New Jersey provides a year-long program combining technical and professional skills training with internships for young adults ages 18–26. The program serves low- and moderate-income students seeking to launch careers in business and technology.",
    "type": "education",
    "location": "85 Broad St, 6th Floor, New York, NY 10004",
    "contact": "(212) 785-3340",
    "website": "https://www.yearup.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": true,
      "requiresDisability": false,
      "zipCodes": ["10004", "10005", "10006"]
    }
  },
  {
    "name": "Goodwill Southern Los Angeles County – Career Center PCH",
    "description": "Goodwill Southern Los Angeles County's Career Center on Pacific Coast Highway offers free job search assistance, resume help, workshops, and referrals to training programs. It focuses on helping low-income job seekers in the Long Beach area secure stable employment.",
    "type": "education",
    "location": "800 W Pacific Coast Hwy, Long Beach, CA 90806",
    "contact": "(562) 216-5260",
    "website": "https://thinkgood.org/career-center-services/",
    "hours": "Mon-Fri 9am-4pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["90806", "90810", "90813"]
    }
  },
  {
    "name": "Chicago Urban League – Workforce Development Center",
    "description": "The Chicago Urban League's Workforce Development Center offers employment services, sector-based training, and job placement assistance. Programs are designed for adults from underrepresented communities, including low-income and long-term unemployed job seekers.",
    "type": "education",
    "location": "4510 S Michigan Ave, Chicago, IL 60653",
    "contact": "(773) 285-5800",
    "website": "https://chiul.org/program/workforce/",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["60653", "60615", "60609"]
    }
  },
  {
    "name": "Austin Community College – Adult Education",
    "description": "Austin Community College's Adult Education Division provides free GED preparation, English as a Second Language, college readiness, and career pathways classes. It serves adults in Central Texas, prioritizing those with limited incomes and educational opportunities.",
    "type": "education",
    "location": "6101 Highland Campus Dr, Building 2000, Austin, TX 78752",
    "contact": "(512) 223-5123",
    "website": "https://adulted.austincc.edu",
    "hours": "Mon-Fri 8am-5pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["78752", "78723", "78753"]
    }
  },
  {
    "name": "Miami Dade College – Single Stop (North Campus)",
    "description": "Single Stop at Miami Dade College's North Campus is a one-stop hub connecting students to public benefits, financial coaching, legal aid, tax preparation, and a campus food pantry. Services are free for MDC students and their immediate family members to help them stay enrolled and complete their education.",
    "type": "education",
    "location": "11380 NW 27th Ave, Room 3101, Miami, FL 33167",
    "contact": "(305) 237-1444",
    "website": "https://www.mdc.edu/singlestop/",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": true,
      "requiresDisability": false,
      "zipCodes": ["33167", "33168", "33169"]
    }
  },
  {
    "name": "United Way of New York City",
    "description": "United Way of New York City partners with community organizations to provide food access, housing stability, education, and financial empowerment services for low-income New Yorkers. It invests in and coordinates programs that support ALICE households across the five boroughs.",
    "type": "nonprofit_aid",
    "location": "205 E 42nd St, 12th Floor, New York, NY 10017",
    "contact": "(212) 251-2500",
    "website": "https://unitedwaynyc.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["10017", "10016", "10019"]
    }
  },
  {
    "name": "Catholic Charities of Los Angeles, Inc.",
    "description": "Catholic Charities of Los Angeles provides emergency food, rental and utility assistance, immigration legal services, and case management through centers across the Archdiocese. Programs prioritize very low- and low-income individuals and families regardless of religious affiliation.",
    "type": "nonprofit_aid",
    "location": "1531 James M Wood Blvd, Los Angeles, CA 90015",
    "contact": "(213) 251-3400",
    "website": "https://catholiccharitiesla.org",
    "hours": "Mon-Fri 8:30am-5pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["90015", "90017", "90006"]
    }
  },
  {
    "name": "United Way of Greater Houston",
    "description": "United Way of Greater Houston funds and coordinates programs that address basic needs, education, financial stability, and health for residents of the Houston region. It connects low-income households to resources through its 2-1-1 Texas/United Way HELPLINE and a network of partner agencies.",
    "type": "nonprofit_aid",
    "location": "50 Waugh Dr, Houston, TX 77007",
    "contact": "(713) 685-2300",
    "website": "https://unitedwayhouston.org",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["77007", "77008", "77009"]
    }
  },
  {
    "name": "United Way Miami (United Way of Miami-Dade)",
    "description": "United Way Miami partners with local nonprofits to support programs in education, financial stability, and health for low- and moderate-income residents of Miami-Dade County. It coordinates emergency assistance, benefits access, and long-term supports for ALICE households.",
    "type": "nonprofit_aid",
    "location": "3250 SW 3rd Ave, Miami, FL 33129",
    "contact": "(305) 646-7000",
    "website": "https://unitedwaymiami.org",
    "hours": "Mon-Fri 9am-5pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["33129", "33130", "33145"]
    }
  },
  {
    "name": "Valley of the Sun United Way",
    "description": "Valley of the Sun United Way serves Maricopa County by funding and coordinating programs for housing stability, hunger relief, and education. It works with community partners to support low-income families in the Phoenix area with basic needs and financial coaching.",
    "type": "nonprofit_aid",
    "location": "3200 E Camelback Rd, Suite 375, Phoenix, AZ 85018",
    "contact": "(602) 631-4800",
    "website": "https://vsuw.org",
    "hours": "Mon-Fri 8am-5pm",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["85018", "85016", "85008"]
    }
  },
  {
    "name": "Workforce Solutions – Gulf Coast Workforce Board",
    "description": "Workforce Solutions is the public workforce system for the Houston–Galveston region, offering job search assistance, training referrals, and support services such as child care and transportation assistance. Services are targeted to unemployed and underemployed residents with low and moderate incomes.",
    "type": "nonprofit_aid",
    "location": "12148-B Gulf Fwy, Houston, TX 77034",
    "contact": "(713) 576-2580",
    "website": "https://www.wrksolutions.com",
    "hours": "Contact for hours",
    "eligibilityCriteria": {
      "maxIncome": 60000,
      "minHouseholdSize": 1,
      "maxHouseholdSize": 8,
      "requiresStudent": false,
      "requiresDisability": false,
      "zipCodes": ["77034", "77089", "77075"]
    }
  }
];

async function seedResources() {
  console.log('🌱 Starting resource seeding process...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const resource of resources) {
    try {
      // Add timestamps
      const resourceData = {
        ...resource,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('resources').add(resourceData);
      console.log(`✅ Added: ${resource.name} (${resource.type}) - ID: ${docRef.id}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to add ${resource.name}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Seeding complete!`);
  console.log(`   ✅ Successfully added: ${successCount} resources`);
  console.log(`   ❌ Failed: ${errorCount} resources`);
  console.log(`\n📈 Breakdown by type:`);

  const typeCounts = resources.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} resources`);
  });
}

// Run the seeding function
seedResources()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
