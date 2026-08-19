export type PortfolioItem = {
  id: string;
  /** category slug — tabs are derived from the distinct values here */
  category: string;
  categoryLabel: string;
  /** Design name, used as the tile caption and in the alt text */
  title: string;
  /** What the work is, shown in the lightbox */
  kind: string;
  image: string;
  /** Intrinsic pixel size of the image (drives the lightbox) */
  width: number;
  height: number;
  /** Aspect ratio for the grid tile. */
  aspect: string;
  /** Designer credited on the source shot, where one was recorded. */
  credit: string | null;
  /** Dribbble shot this image came from. */
  source: string;
};

export type PortfolioCategory = { slug: string; label: string };

/**
 * Industry portfolio: ten verticals, five website designs each.
 *
 * The images are Dribbble shots downloaded by `scripts/fetch-dribbble-shots.mjs`
 * — they are other designers' work, not projects delivered by this agency, so
 * each item keeps the designer credit and the source shot URL. Swap the files
 * in `public/portfolio/dribbble/` for real project captures when they exist;
 * only the entries below need to change with them.
 */
const CATEGORIES: {
  slug: string;
  label: string;
  kind: string;
  items: {
    file: string;
    title: string;
    credit: string | null;
    source: string;
    width: number;
    height: number;
  }[];
}[] = [
  {
    slug: "plumbing",
    label: "Plumbing",
    kind: "Plumbing website design",
    items: [
      {
        file: "plumbing-1.webp",
        title: "Plumbing Website Design WordPress Design",
        credit: "Riaad Arif",
        source: "https://dribbble.com/shots/24042530-Plumbing-Website-Design-WordPress-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "plumbing-2.webp",
        title: "Plumbing website design",
        credit: "Angshuman Roy",
        source: "https://dribbble.com/shots/25286885-Plumbing-website-design",
        width: 1200,
        height: 900,
      },
      {
        file: "plumbing-3.webp",
        title: "Plumbing Service Website Design",
        credit: "FleexStudio",
        source: "https://dribbble.com/shots/26829951-Plumbing-Service-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "plumbing-4.webp",
        title: "Plumbing and Home Services Website",
        credit: "Oyolloo",
        source: "https://dribbble.com/shots/17121780-Plumbing-and-Home-Services-Website",
        width: 1200,
        height: 900,
      },
      {
        file: "plumbing-5.webp",
        title: "Plumbing Website homepage UI Design",
        credit: "Abir",
        source: "https://dribbble.com/shots/23124075-Plumbing-Website-homepage-UI-Design",
        width: 1200,
        height: 900,
      },
    ],
  },
  {
    slug: "hvac",
    label: "HVAC",
    kind: "HVAC website design",
    items: [
      {
        file: "hvac-1.webp",
        title: "HVAC Company Website Design",
        credit: "FleexStudio",
        source: "https://dribbble.com/shots/27442958-HVAC-Company-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "hvac-2.webp",
        title: "AirNova HVAC Service Website Design",
        credit: "Origin UX Studio",
        source: "https://dribbble.com/shots/27062327-AirNova-HVAC-Service-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "hvac-3.webp",
        title: "Air Conditioning Heating HVAC Website Template",
        credit: "Md. Abdullah on",
        source: "https://dribbble.com/shots/26905208-Air-Conditioning-Heating-HVAC-Website-Template",
        width: 1200,
        height: 900,
      },
      {
        file: "hvac-4.webp",
        title: "Acool Modern HVAC Services Website UI",
        credit: "Nextdin Studio",
        source: "https://dribbble.com/shots/27190769-Acool-Modern-HVAC-Services-Website-UI",
        width: 1200,
        height: 900,
      },
      {
        file: "hvac-5.webp",
        title: "Air Conditioning HVAC Website UI UX",
        credit: "Taihg McDonagh",
        source: "https://dribbble.com/shots/25710298-Air-Conditioning-HVAC-Website-UI-UX",
        width: 1200,
        height: 900,
      },
    ],
  },
  {
    slug: "dental",
    label: "Dental",
    kind: "Dental practice website design",
    items: [
      {
        file: "dental-1.webp",
        title: "Dentistry Dental Clinic Website Template",
        credit: "Md Asaduzzaman",
        source: "https://dribbble.com/shots/27104828-Dentistry-Dental-Clinic-Website-Template",
        width: 1200,
        height: 900,
      },
      {
        file: "dental-2.webp",
        title: "Dentist and Dental Clinic Website UIUX Design Figma Design",
        credit: "",
        source: "https://dribbble.com/shots/25264931-Dentist-and-Dental-Clinic-Website-UIUX-Design-Figma-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "dental-3.webp",
        title: "Dental Clinic Website",
        credit: "FleexStudio",
        source: "https://dribbble.com/shots/24503977-Dental-Clinic-Website",
        width: 1200,
        height: 900,
      },
      {
        file: "dental-4.webp",
        title: "Dental Clinic Website Design",
        credit: "Ilijana Bozic",
        source: "https://dribbble.com/shots/26941461-Dental-Clinic-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "dental-5.webp",
        title: "SmileCraft Modern Dental Clinic Website Design Dental Web",
        credit: "Jabel",
        source: "https://dribbble.com/shots/26427564-SmileCraft-Modern-Dental-Clinic-Website-Design-Dental-Web",
        width: 1200,
        height: 900,
      },
    ],
  },
  {
    slug: "roofing",
    label: "Roofing",
    kind: "Roofing website design",
    items: [
      {
        file: "roofing-1.webp",
        title: "Roofing Company Website design",
        credit: "Himanshu Tomar",
        source: "https://dribbble.com/shots/24364156-Roofing-Company-Website-design",
        width: 1200,
        height: 900,
      },
      {
        file: "roofing-2.webp",
        title: "Roofing website design",
        credit: "illuminz",
        source: "https://dribbble.com/shots/26709559-Roofing-website-design",
        width: 1200,
        height: 900,
      },
      {
        file: "roofing-3.webp",
        title: "Modern Roofing Services Website UI Design",
        credit: "Md. Rakibul Islam",
        source: "https://dribbble.com/shots/27313080-Modern-Roofing-Services-Website-UI-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "roofing-4.webp",
        title: "Roofing Services Website Small Business",
        credit: "AR Abdur Rouf",
        source: "https://dribbble.com/shots/26094219-Roofing-Services-Website-Small-Business",
        width: 1200,
        height: 900,
      },
      {
        file: "roofing-5.webp",
        title: "Roofing Service Website Design",
        credit: "Sahil Dobariya",
        source: "https://dribbble.com/shots/24143431-Roofing-Service-Website-Design",
        width: 1200,
        height: 900,
      },
    ],
  },
  {
    slug: "landscaping",
    label: "Landscaping",
    kind: "Landscaping website design",
    items: [
      {
        file: "landscaping-1.webp",
        title: "Landscape Gardening Website Design",
        credit: "Sohanur Rahman",
        source: "https://dribbble.com/shots/26624771-Landscape-Gardening-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "landscaping-2.webp",
        title: "Landscaping Website Design",
        credit: "Sachin Walia",
        source: "https://dribbble.com/shots/19462724-Landscaping-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "landscaping-3.webp",
        title: "Landscaping Website",
        credit: "Onvision",
        source: "https://dribbble.com/shots/25124179-Landscaping-Website",
        width: 1200,
        height: 900,
      },
      {
        file: "landscaping-4.webp",
        title: "Gardening Landscaping website Design",
        credit: "FleexStudio",
        source: "https://dribbble.com/shots/25880491-Gardening-Landscaping-website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "landscaping-5.webp",
        title: "Construction Landscaping Web Design",
        credit: "Alyssa Wychers for Double Up",
        source: "https://dribbble.com/shots/19813818-Construction-Landscaping-Web-Design",
        width: 1200,
        height: 900,
      },
    ],
  },
  {
    slug: "auto-repair",
    label: "Auto Repair",
    kind: "Auto repair website design",
    items: [
      {
        file: "auto-repair-1.webp",
        title: "Auto Repair Car Website Design Temaplate Car Website",
        credit: "DQ Australia",
        source: "https://dribbble.com/shots/26040359-Auto-Repair-Car-Website-Design-Temaplate-Car-Website",
        width: 1200,
        height: 900,
      },
      {
        file: "auto-repair-2.webp",
        title: "Car Repair Website Deign",
        credit: "Habibullah Misbah",
        source: "https://dribbble.com/shots/19798210-Car-Repair-Website-Deign",
        width: 1200,
        height: 900,
      },
      {
        file: "auto-repair-3.webp",
        title: "Auto Repair Shop Website Concept",
        credit: "Cesar Martinez",
        source: "https://dribbble.com/shots/26075900-Auto-Repair-Shop-Website-Concept",
        width: 1200,
        height: 900,
      },
      {
        file: "auto-repair-4.webp",
        title: "AutoWorks Black and Red Minimalist Modern Auto Repair Website",
        credit: "",
        source: "https://dribbble.com/shots/23532914-AutoWorks-Black-and-Red-Minimalist-Modern-Auto-Repair-Website",
        width: 1200,
        height: 900,
      },
      {
        file: "auto-repair-5.webp",
        title: "Auto Repair Website UI Clean Bold and Conversion Focused",
        credit: "John",
        source: "https://dribbble.com/shots/25905882-Auto-Repair-Website-UI-Clean-Bold-and-Conversion-Focused",
        width: 1200,
        height: 758,
      },
    ],
  },
  {
    slug: "law-firm",
    label: "Law Firm",
    kind: "Law firm website design",
    items: [
      {
        file: "law-firm-1.webp",
        title: "Law Firm Website",
        credit: "Oripio",
        source: "https://dribbble.com/shots/26835482-Law-Firm-Website",
        width: 1200,
        height: 900,
      },
      {
        file: "law-firm-2.webp",
        title: "Law Firm Website Design",
        credit: "Hossain Easin",
        source: "https://dribbble.com/shots/20551085-Law-Firm-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "law-firm-3.webp",
        title: "Law Firm Website",
        credit: "Oripio",
        source: "https://dribbble.com/shots/26835482-Law-Firm-Website",
        width: 1200,
        height: 900,
      },
      {
        file: "law-firm-4.webp",
        title: "Law firm website design",
        credit: "Towhidul Mowla",
        source: "https://dribbble.com/shots/20243418-Law-firm-website-design",
        width: 1200,
        height: 900,
      },
      {
        file: "law-firm-5.webp",
        title: "Law Firm Website Design",
        credit: "UIbyZak",
        source: "https://dribbble.com/shots/26283184-Law-Firm-Website-Design",
        width: 1200,
        height: 900,
      },
    ],
  },
  {
    slug: "restaurant",
    label: "Restaurant",
    kind: "Restaurant website design",
    items: [
      {
        file: "restaurant-1.webp",
        title: "Restaurant website design",
        credit: "UI verse",
        source: "https://dribbble.com/shots/27022896-Restaurant-website-design",
        width: 1200,
        height: 810,
      },
      {
        file: "restaurant-2.webp",
        title: "Restaurant Web Design",
        credit: "Anastasiia Rempel",
        source: "https://dribbble.com/shots/21876372-Restaurant-Web-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "restaurant-3.webp",
        title: "Restaurant Website",
        credit: "Pranjal Gupta",
        source: "https://dribbble.com/shots/23811872-Restaurant-Website",
        width: 1200,
        height: 900,
      },
      {
        file: "restaurant-4.webp",
        title: "Food Restaurant Website Design",
        credit: "Simran Arshad",
        source: "https://dribbble.com/shots/24117299-Food-Restaurant-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "restaurant-5.webp",
        title: "Restaurant Website Design",
        credit: "Habibur Rahman",
        source: "https://dribbble.com/shots/24181137-Restaurant-Website-Design",
        width: 1200,
        height: 900,
      },
    ],
  },
  {
    slug: "fitness",
    label: "Fitness",
    kind: "Gym & fitness website design",
    items: [
      {
        file: "fitness-1.webp",
        title: "Gym Fitness Website Design Landing Page",
        credit: "Mithila",
        source: "https://dribbble.com/shots/23615190-Gym-Fitness-Website-Design-Landing-Page",
        width: 1200,
        height: 900,
      },
      {
        file: "fitness-2.webp",
        title: "Gym Fitness Website Landing Page Design",
        credit: "Md Abu Umayer Sarker",
        source: "https://dribbble.com/shots/21948842-Gym-Fitness-Website-Landing-Page-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "fitness-3.webp",
        title: "Gym Fitness Website Design",
        credit: "Mahamud Hassan (Riad)",
        source: "https://dribbble.com/shots/20943324-Gym-Fitness-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "fitness-4.webp",
        title: "Gym Fitness Website Landing Page UI",
        credit: "Arham Techpro - UI/UX Design",
        source: "https://dribbble.com/shots/23451498-Gym-Fitness-Website-Landing-Page-UI",
        width: 1200,
        height: 900,
      },
      {
        file: "fitness-5.webp",
        title: "Gym Fitness Website Design",
        credit: "Saiful Islam Shawon for Interfacly on",
        source: "https://dribbble.com/shots/26542155-Gym-Fitness-Website-Design",
        width: 1200,
        height: 900,
      },
    ],
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    kind: "Real estate website design",
    items: [
      {
        file: "real-estate-1.webp",
        title: "Real Estate Website Design",
        credit: "Muhammad Hassan",
        source: "https://dribbble.com/shots/26776478-Real-Estate-Website-Design",
        width: 1200,
        height: 1000,
      },
      {
        file: "real-estate-2.webp",
        title: "Real Estate Website Design",
        credit: "Tayyaba Yousaf",
        source: "https://dribbble.com/shots/26527142-Real-Estate-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "real-estate-3.webp",
        title: "Real Estate Website Design",
        credit: "Abu Hasan",
        source: "https://dribbble.com/shots/27267353-Real-Estate-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "real-estate-4.webp",
        title: "Real Estate Website Design",
        credit: "Madhu Miah",
        source: "https://dribbble.com/shots/26623045-Real-Estate-Website-Design",
        width: 1200,
        height: 900,
      },
      {
        file: "real-estate-5.webp",
        title: "Real Estate Website",
        credit: "Madhu Miah",
        source: "https://dribbble.com/shots/26229533-Real-Estate-Website",
        width: 1200,
        height: 900,
      },
    ],
  },
];

export const portfolioItems: PortfolioItem[] = CATEGORIES.flatMap((c) =>
  c.items.map((s, i) => ({
    id: `${c.slug}-${i + 1}`,
    category: c.slug,
    categoryLabel: c.label,
    title: s.title,
    kind: c.kind,
    image: `/portfolio/dribbble/${s.file}`,
    width: s.width,
    height: s.height,
    // Shots are presentation compositions — show them whole rather than cropping.
    aspect: `${s.width}/${s.height}`,
    credit: s.credit,
    source: s.source,
  })),
);

/** Tabs are derived from the data — adding a category is adding items. */
export const portfolioCategories: PortfolioCategory[] = portfolioItems.reduce<PortfolioCategory[]>(
  (acc, item) => {
    if (!acc.some((c) => c.slug === item.category)) {
      acc.push({ slug: item.category, label: item.categoryLabel });
    }
    return acc;
  },
  [],
);

export const itemsByCategory = (slug: string): PortfolioItem[] =>
  portfolioItems.filter((i) => i.category === slug);
