export const countries = [
  { id: 'Canada', name: "Canada"},
  { id: 'US', name: "État-Unis"}
]

export const provincesUS = [
  { id: "New-York", name: "New-York" },
  { id: "Vermont", name: "Vermont" },
  { id: "Maine", name: "Maine" },
  { id: "New-Hampshire", name: "New-Hampshire" }
]

export const provinces = [
    { id: "Alberta", name: "Alberta" },
    { id: "Colombie-Britannique", name: "Colombie-Britannique" },
    { id: "Manitoba", name: "Manitoba" },
    { id: "Nouveau-Brunswick", name: "Nouveau-Brunswick" },
    { id: "Terre-Neuve-et-Labrador", name: "Terre-Neuve-et-Labrador" },
    { id: "Nouvelle-Écosse", name: "Nouvelle-Écosse" },
    { id: "Territoires du Nord-Ouest", name: "Territoires du Nord-Ouest" },
    { id: "Nunavut", name: "Nunavut" },
    { id: "Ontario", name: "Ontario" },
    { id: "Île-du-Prince-Édouard", name: "Île-du-Prince-Édouard" },
    { id: "Québec", name: "Québec" },
    { id: "Saskatchewan", name: "Saskatchewan" },
    { id: "Yukon", name: "Yukon" }
]


const regions = [
    { value: 6078, label: "Îles-de-la-Madeleine" },
    { value: 6079, label: "Gaspésie" },
    { value: 6080, label: "Bas-Saint-Laurent" },
    { value: 6082, label: "Charlevoix" },
    { value: 6083, label: "Chaudière-Appalaches" },
    { value: 6084, label: "Mauricie" },
    { value: 6085, label: "Cantons-de-l'Est" },
    { value: 6086, label: "Montérégie" },
    { value: 6087, label: "Lanaudière" },
    { value: 6088, label: "Laurentides" },
    { value: 6081, label: "Région de Québec" },
    { value: 6089, label: "Montréal" },
    { value: 6090, label: "Outaouais" },
    { value: 6091, label: "Abitibi-Témiscamingue" },
    { value: 6092, label: "Saguenay-Lac-Saint-Jean" },
    { value: 6093, label: "Manicouagan" },
    { value: 6094, label: "Duplessis" },
    { value: 6095, label: "Baie-James et Eeyou Istchee" },
    { value: 6096, label: "Laval" },
    { value: 6097, label: "Centre-du-Québec" },
    { value: 6098, label: "Nunavik" },
    { value: 6099, label: "Côte-Nord" },
    { value: 6100, label: "Nord-du-Québec" }
]

export const orderedRegions = regions.sort( function (a, b) {
	if (a.label < b.label) {
		return -1
	}
	if (a.label > b.label) {
		return 1
	}
	return 0
	}
)
