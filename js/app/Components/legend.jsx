import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import ReactDom from "react-dom";

//Redux store
import store from "../Store/store.jsx";
import { SITE_PATH } from "../config.jsx";
import {poiLegendChange} from "../Actions/actions.jsx";
import {Sport} from "../Reducers/reducers.js";

import {Accordion, AccordionItem} from "../Components/basic_components/accordion.jsx";
import {heberRestPoiItems, activityPoiItems, autrePoiItems, parkingPoiItem, getNewState} from "../Components/utils/legendCheckboxHelpers.jsx"

import poi from '../Components/utils/poiLists.js'

const mapStateToProps = (state) => {
    return {
        legend: state.legend
    }
}

export class Legend extends Component  {
    static propTypes = {
        legend: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
          chosenActivity: activityPoiItems,
          chosenHeberRest: heberRestPoiItems,
          chosenAutre: autrePoiItems,
          chosenParking: parkingPoiItem
        };

        this.sport = [];

        this.sport['Sentiers'] = new Map([
            [100, "Randonnée pédestre"],
            [101, "Raquette"]
        ]);
    }


    handleSportChange() {
      store.dispatch(poiLegendChange({
        sport: this.getSport(),
        poiVisibility: this.getPOIVisibility()
      }));

      event.stopPropagation();
    }

    handlePoiChange(category, event) {

        switch (category) {

          case "Hébergement / restaurant":
            this.setState({chosenHeberRest: getNewState(this.state.chosenHeberRest, +event.target.value)})
            break;

          case "Activité":
            this.setState({chosenActivity: getNewState(this.state.chosenActivity, +event.target.value)})
            break;

          case "Autre":
             this.setState({chosenAutre: getNewState(this.state.chosenAutre, +event.target.value)})
             break;

          case "Stationnement":
             this.state.chosenParking.indexOf(+event.target.value) < 0 ? this.state.chosenParking.push(+event.target.value) : this.state.chosenParking.splice(0, 1);
             break;

          default:
             return this.state
             console.log('Please check the categories.')
        }

        store.dispatch(poiLegendChange({
            sport: this.getSport(),
            poiVisibility: this.getPOIVisibility()
        }));

        event.stopPropagation();
    }

    handleSelectAll(category) {

        switch (category) {

          case "Hébergement / restaurant":

            if (this.state.chosenHeberRest.length === heberRestPoiItems.length ) {
              this.setState({chosenHeberRest: []})
            }

            if (this.state.chosenHeberRest.length < heberRestPoiItems.length) {
              this.setState({chosenHeberRest: heberRestPoiItems})
            }

            break;

          case "Activité":

            if (this.state.chosenActivity.length === activityPoiItems.length ) {
              this.setState({chosenActivity: []})
            }

            if (this.state.chosenActivity.length < activityPoiItems.length) {
              this.setState({chosenActivity: activityPoiItems})
            }

          break;

          case "Autre":

            if (this.state.chosenAutre.length === autrePoiItems.length) {
              this.setState({chosenAutre: []})

            }

            if (this.state.chosenAutre.length < autrePoiItems.length) {
              this.setState({chosenAutre: autrePoiItems})
            }

          break;

          default:
            return this.state
            console.log('please check whether the categories are correct')
        }

        this.forceUpdate( () =>
            store.dispatch(poiLegendChange({
              sport: this.getSport(),
              poiVisibility: this.getPOIVisibility()
            }))
        )
    }

    getSport(){
        let sport = "Aucun";

        let sport100 = document.getElementById('sport-' + 100).checked;
        let sport101 = document.getElementById('sport-' + 101).checked;

        if (sport100 && sport101){ sport = Sport.ALL; }
        else if (sport100){ sport = Sport.RANDONNEE; }
        else if (sport101){ sport = Sport.RAQUETTE; }

        return sport;
    }

    getPOIVisibility(){
        let state = [];
        let domNode = ReactDom.findDOMNode(this);
        for(let poiItem of domNode.querySelectorAll('.poi-item input')){

            if (poiItem.checked){
                let id = poiItem.id.replace('poi-', '');
                state.push(id);
            }
        }
        return state.join();
    }

    render(){

        // SPORT
        let sportContent = [];

        Object.keys(this.sport).forEach((category) => {
            let sportCategoryItems = [];
            this.sport[category].forEach((value, key) => {
                let sportKey = "sport-" + key;
                let sportIcon = "url(/static/img/markers/Icones_Hikster_" + key + ".svg)";
                sportCategoryItems.push((
                    <div className="sport-item" key={key}>
                        <div className="icon"><div className="icon-inner" style={{backgroundImage: sportIcon}}></div></div>
                        <div className="ui checkbox">
                          <input id={sportKey} type="checkbox" onChange={this.handleSportChange.bind(this)} defaultChecked={true} />
                          <label htmlFor={sportKey}>{value}</label>
                        </div>
                    </div>
                ));
            });

            sportContent.push((
                <div className="sport-category" key={category}>
                    <div className="sport-category-title">{category}</div>
                    <div className="sport-items">{sportCategoryItems}</div>
                </div>
            ));
        });

        // POI
        let poiContent = [];

        Object.keys(poi).forEach((category) => {

            var chosenState = [];
            var poiItemsSize;

            switch (category) {

              case "Hébergement / restaurant":
                chosenState = this.state.chosenHeberRest;
                poiItemsSize = poi["Hébergement / restaurant"].size;
                break;
              case "Activité":
                chosenState = this.state.chosenActivity;
                poiItemsSize = poi["Activité"].size;
                break;
              case "Autre":
                 chosenState = this.state.chosenAutre;
                 poiItemsSize = poi["Autre"].size;
                 break;
              case "Stationnement":
                 chosenState = this.state.chosenParking;
                 poiItemsSize = poi["Stationnement"].size;
                 break;
              default:
                 console.log('please check the categoies')
            }

            let poiCategoryItems = [];

            poi[category].forEach((value, key) => {
                let poiKey = "poi-" + key;
                let poiIcon = "url(/static/img/markers/Icones_Hikster_" + key + ".svg)"
                poiCategoryItems.push((
                    <div className="poi-item" key={key}>
                        <div className="icon"><div className="icon-inner" style={{backgroundImage: poiIcon}}></div></div>
                        <div className="ui checkbox">
                          <input id={poiKey} value={key} type="checkbox" onChange={ (event) => this.handlePoiChange(category, event)} checked={chosenState.indexOf(key) >= 0} />
                          <label htmlFor={poiKey}>{value}</label>
                        </div>
                    </div>
                ));
            });

            poiContent.push((
                <div className="poi-category" title={`${category}  >`}  key={category}>

                { category !== "Stationnement" ?
                    <div className="ui checkbox select-all">
                    <input type="checkbox" id="select-all"
                            checked={chosenState.length === poiItemsSize}
                            onChange={this.handleSelectAll.bind(this, category)}
                    />
                    <label htmlFor="select-all"> Tout Sélectionner</label>
                    </div> : null
                }
                    <div className="poi-items">{poiCategoryItems}</div>
                </div>
            ));
        });

        return (
            <div className="legend-content">

                <div className="sport-categories">
                    { sportContent }
                </div>


                <div className="poi-categories">
                    { poiContent }
                </div>

            </div>
        )

    }
}

Legend = connect(mapStateToProps)(Legend)
