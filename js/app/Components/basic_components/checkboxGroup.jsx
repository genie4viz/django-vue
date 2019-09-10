import React, {Component, PropTypes} from "react";
import ReactDom from "react-dom";

const heberRestArr = [
  {2: "Abri chauffé"},
  {3: "Abri/relais/halte"},
  {7: "Auberge/gîte"},
  {58: "Auberge de jeunesse"},
  {11: "Camping"},
  {16: "Chalet/appartement"},
  {18: "Dépanneur/épicerie"},
  {64: "Hébergement insolite"},
  {71: "Hôtel"},
  {28: "Lean to"},
  {57: "Pourvoirie"},
  {42: "Refuge"},
  {44: "Restauration"},
  {80: "SPA"}
];

const parkingArr = [
  [33, "Stationnement"]
]);

const activityArr = [
  [14, "Canot-camping"],
  [21, "Équitation"],
  [20, "Embarcation/canot/kayak"],
  [22, "Escalade"],
  [29, "Location d'équipements"],
  [30, "Minigolf"],
  [31, "Natation/plage"],
  [41, "Rampe de mise à l'eau"]
]);

const autreArr = [
  [4, "Aire de pique-nique"],
  [8, "Autobus/navette"],
  [9, "Belvédère/point de vue"],
  [68, "Boutique"],
  [69, "Cascade/Chute"],
  [19, "Eau potable"],
  [67, "Douche"],
  [25, "Guichet"],
  [27, "Information/poste d'accueil"],
  [70, "Monument"],
  [32, "Panneau d'interprétation"],
  [40, "Premier soin"],
  [39, "Poste ou borne de perception"],
  [74, "Secours"],
  [46, "Sommet"],
  [75, "Table d'orientation"],
  [47, "Téléphone"],
  [48, "Téléphone urgence"],
  [50, "Toilettes"],
  [51, "Toilettes sèches"],
  [77, "Wi-Fi"],
  [78, "Wi-Fi gratuit"]
]);

const POI = new Map([
  {'Hébergement / restaurant': heberRestArr},
  {'Stationnement': parkingArr},
  {'Activité': activityArr},
  {'Autre': autreArr}
])
