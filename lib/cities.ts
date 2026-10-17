export const cities = [
  {
    slug: "piscine-vieux-conde",
    name: "Vieux-Condé",
    lead: "Basée à Vieux-Condé, Bâti Pool vous accompagne dans vos projets de piscine en béton et de travaux de bâtiment. Construction, rénovation, entretien et aménagement des abords : échangeons sur votre besoin.",
    pool: "À Vieux-Condé, nous étudions la création d’un bassin, la rénovation d’une piscine existante ou les interventions d’entretien en partant de votre espace et de vos attentes.",
    building: "Depuis Vieux-Condé, notre activité couvre également la maçonnerie, la pose de carrelage et la réalisation de dalles béton pour vos aménagements intérieurs et extérieurs.",
    project: "Pour une piscine à Vieux-Condé, décrivez-nous le terrain ou le bassin existant, l’usage souhaité et les travaux à prévoir autour. Notre adresse locale facilite un premier échange sur votre projet avant la préparation d’un devis.",
  },
  {
    slug: "piscine-valenciennes",
    name: "Valenciennes",
    lead: "Vous envisagez une piscine en béton à Valenciennes ou des travaux pour aménager votre extérieur ? Bâti Pool vous accompagne de la première description du projet jusqu’aux travaux à prévoir.",
    pool: "Un bassin neuf, une piscine à remettre en état ou un entretien à planifier : décrivez-nous votre besoin à Valenciennes pour étudier une solution adaptée à votre espace et à votre usage.",
    building: "Pour préparer les abords d’un bassin ou transformer un espace existant à Valenciennes, nous intervenons aussi en maçonnerie, pose de carrelage et réalisation de dalles béton.",
    project: "À Valenciennes, un projet de piscine peut commencer par une idée d’aménagement du jardin ou par la rénovation d’un bassin existant. Précisez la place disponible, l’état actuel et le résultat souhaité : ces éléments nous aideront à échanger utilement sur les travaux.",
  },
  {
    slug: "piscine-lille",
    name: "Lille",
    lead: "Pour un projet de piscine en béton à Lille, Bâti Pool prend en compte l’espace disponible, les accès et les finitions envisagées. Construction, rénovation et entretien peuvent être abordés dans une même demande de devis.",
    pool: "Vous souhaitez créer un bassin ou redonner vie à une piscine à Lille ? Nous échangeons sur la configuration de votre terrain, l’usage attendu et les interventions nécessaires.",
    building: "Un projet bien intégré passe aussi par ses abords : maçonnerie, carrelage et dalle béton peuvent compléter vos travaux de piscine à Lille.",
    project: "À Lille, la première étape consiste à décrire votre espace et les contraintes que vous connaissez déjà. Un jardin à aménager, une piscine existante à rénover ou des finitions à reprendre n’appellent pas la même préparation ; votre demande nous permet de préciser la suite avec vous.",
  },
  {
    slug: "piscine-lens",
    name: "Lens",
    lead: "Bâti Pool intervient à Lens pour les projets de piscine en béton, de la construction à la rénovation et à l’entretien. Nous réalisons également les travaux de bâtiment qui accompagnent votre aménagement.",
    pool: "À Lens, votre demande peut porter sur un nouveau bassin, une piscine existante à rénover ou un entretien. Expliquez-nous ce qui est déjà en place et ce que vous voulez changer.",
    building: "Dalle béton, carrelage et maçonnerie permettent de préparer ou de compléter un aménagement extérieur à Lens, autour de la piscine comme ailleurs sur la propriété.",
    project: "Pour un projet à Lens, quelques informations concrètes font gagner du temps : dimensions approximatives, état du bassin s’il existe déjà, revêtements souhaités et accès au chantier. Nous pourrons ainsi discuter des travaux pertinents avant d’établir un devis.",
  },
  {
    slug: "piscine-maubeuge",
    name: "Maubeuge",
    lead: "À Maubeuge, Bâti Pool accompagne vos projets de piscine en béton et vos travaux de bâtiment. Création de bassin, rénovation, entretien ou aménagement des abords : parlons de ce que vous souhaitez réaliser.",
    pool: "Qu’il s’agisse de construire une piscine à Maubeuge ou d’intervenir sur un bassin existant, nous partons de vos besoins et des caractéristiques du lieu.",
    building: "Nous pouvons également étudier vos travaux de maçonnerie, de carrelage et de dalle béton à Maubeuge pour créer un ensemble cohérent autour de votre projet.",
    project: "À Maubeuge, un aménagement peut réunir plusieurs étapes : préparer le support, construire ou rénover le bassin, puis traiter les abords. Décrivez les travaux que vous avez en tête, même si certains choix restent à faire ; nous les préciserons lors de notre échange.",
  },
  {
    slug: "piscine-cambrai",
    name: "Cambrai",
    lead: "Vous recherchez une entreprise pour une piscine à Cambrai ? Bâti Pool intervient pour la construction et la rénovation de piscines en béton, leur entretien et les travaux d’aménagement associés.",
    pool: "Piscine neuve, bassin à rénover ou entretien : à Cambrai, nous étudions votre demande en fonction de l’existant, de l’espace disponible et de la façon dont vous comptez utiliser la piscine.",
    building: "Pour accompagner votre piscine à Cambrai, nous proposons aussi la maçonnerie, la pose de carrelage et la réalisation de dalles béton, notamment pour les espaces qui entourent le bassin.",
    project: "Pour votre projet de piscine à Cambrai, indiquez si le bassin est à créer ou à reprendre, les travaux souhaités autour de lui et les contraintes déjà identifiées. Ces précisions nous permettront de préparer un premier échange et un devis adapté au chantier.",
  },
] as const;

export type City = (typeof cities)[number];

export function getCity(slug: string) {
  return cities.find((city) => city.slug === slug);
}
