/**
 * Visuels catégories — fichiers dans public/images/categories/
 */
function categoryImage(file) {
    return `/images/categories/${encodeURIComponent(file)}`;
}

export const categoryVisualHints = {
    'outillage-materiel-industriel': {
        file: "meuleuse_d'angle_pro.png",
        hint: 'PNG : perceuse visseuse ou meuleuse d\'angle professionnelle, vue 3/4, fond transparent',
    },
    'materiel-agricole': {
        file: 'Pulvérisateur_dorsal.png',
        hint: 'PNG : pulvérisateur dorsal, pompe d\'irrigation ou lot de raccords agricoles',
    },
    'tuyauterie-raccords': {
        file: 'Tuyauterie_Raccords.png',
        hint: 'PNG : ensemble de raccords, vannes et tuyaux en laiton/inox, composition produit',
    },
    'pompes-motopompes': {
        file: 'pompe_centrifuge.png',
        hint: 'PNG : motopompe ou pompe centrifuge industrielle, rendu studio',
    },
    'protection-individuelle': {
        file: 'casque_lunettes_gants.png',
        modifier: 'category-showcase__visual-wrap--large',
        hint: 'PNG : casque + lunettes + gants de sécurité, pack EPI',
    },
    'quincaillerie-droguerie': {
        file: 'Boîte_organisateur_vis.png',
        hint: 'PNG : assortiment vis, chevilles, boîte d\'organisateur ou lot quincaillerie',
    },
};

export function getCategoryVisual(category) {
    const visual = categoryVisualHints[category?.slug];
    if (visual?.file) {
        return categoryImage(visual.file);
    }

    return category?.image_url || categoryImage('pompe_centrifuge.png');
}

export function getCategoryVisualHint(category) {
    return categoryVisualHints[category?.slug]?.hint || 'PNG produit isolé sur fond transparent';
}

export function getCategoryVisualModifier(category) {
    return categoryVisualHints[category?.slug]?.modifier || null;
}
