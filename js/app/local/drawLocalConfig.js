const drawLocalConfig = {
    en: {
        draw: {
            toolbar: {
                // #TODO: this should be reorganized where actions are nested in actions
                // ex: actions.undo  or actions.cancel
                actions: {
                    title: 'Cancel drawing',
                    text: 'Cancel'
                },
                finish: {
                    title: 'Finish drawing',
                    text: 'Finish'
                },
                undo: {
                    title: 'Delete last point drawn',
                    text: 'Delete last point'
                },
                buttons: {
                    polyline: 'Draw a polyline',
                    polygon: 'Draw a polygon',
                    rectangle: 'Draw a rectangle',
                    circle: 'Draw a circle',
                    marker: 'Draw a marker'
                }
            },
/*
            handlers: {
                circle: {
                    tooltip: {
                        start: 'Click and drag to draw circle.'
                    },
                    radius: 'Radius'
                },
                marker: {
                    tooltip: {
                        start: 'Click map to place marker.'
                    }
                },
                polygon: {
                    tooltip: {
                        start: 'Click to start drawing shape.',
                        cont: 'Click to continue drawing shape.',
                        end: 'Click first point to close this shape.'
                    }
                },
                polyline: {
                    error: '<strong>Error:</strong> shape edges cannot cross!',
                    tooltip: {
                        start: 'Click to start drawing line.',
                        cont: 'Click to continue drawing line.',
                        end: 'Click last point to finish line.'
                    }
                },
                rectangle: {
                    tooltip: {
                        start: 'Click and drag to draw rectangle.'
                    }
                },
                simpleshape: {
                    tooltip: {
                        end: 'Release mouse to finish drawing.'
                    }
                }
            }
*/
        },
        edit: {
            toolbar: {
                actions: {
                    save: {
                        title: 'Save changes.',
                        text: 'Save'
                    },
                    cancel: {
                        title: 'Cancel editing, discards all changes.',
                        text: 'Cancel'
                    },
                    clearAll: {
                        title: 'clear all layers.',
                        text: 'Clear All'
                    }
                },
                buttons: {
                    edit: 'Edit layers.',
                    editDisabled: 'No layers to edit.',
                    remove: 'Delete layers.',
                    removeDisabled: 'No layers to delete.'
                }
            },
/*
            handlers: {
                edit: {
                    tooltip: {
                        text: 'Drag handles, or marker to edit feature.',
                        subtext: 'Click cancel to undo changes.'
                    }
                },
                remove: {
                    tooltip: {
                        text: 'Click on a feature to remove'
                    }
                }
            }
*/
        }
    },
    fr: {
        draw: {
            toolbar: {
                // #TODO: this should be reorganized where actions are nested in actions
                // ex: actions.undo  or actions.cancel
                actions: {
                    title: 'Annuler dessin',
                    text: 'Annuler'
                },
                finish: {
                    title: 'Terminer dessin',
                    text: 'Terminer'
                },
                undo: {
                    title: 'Supprimer le dernier point dessiné',
                    text: 'Supprimer le dernier point'
                },
                buttons: {
                    polyline: 'Dessiner une ligne',
                    polygon: 'Dessiner un polygone',
                    rectangle: 'Dessiner un rectangle',
                    circle: 'Dessiner un cercle',
                    marker: 'Dessiner un point marqueur'
                }
            },
/*
            handlers: {
                circle: {
                    tooltip: {
                        start: 'Cliquer et glisser pour dessiner un cercle.'
                    },
                    radius: 'Radius'
                },
                marker: {
                    tooltip: {
                        start: 'Cliquer sur la carte pour dessiner un point marqueur.'
                    }
                },
                polygon: {
                    tooltip: {
                        start: 'Cliquer pour commencer à dessiner un polygone.',
                        cont: 'Cliquer pour continuer à dessiner un polygone.',
                        end: 'Cliquer sur le premier point pour finir le polygone.'
                    }
                },
                polyline: {
                    error: '<strong>Erreur:</strong> les lignes ne peuvent pas se croiser!',
                    tooltip: {
                        start: 'Cliquer pour dessiner une ligne.',
                        cont: 'Cliquer pour continuer a dessiner la ligne.',
                        end: 'Cliquer le dernier point pour finir la ligne.'
                    }
                },
                rectangle: {
                    tooltip: {
                        start: 'Cliquer et glisser pour dessiner un rectangle.'
                    }
                },
                simpleshape: {
                    tooltip: {
                        end: 'Relacher le clique de souris pour terminer.'
                    }
                }
            }
*/
        },
        edit: {
            toolbar: {
                actions: {
                    save: {
                        title: 'Sauvegarder changements.',
                        text: 'Sauvegarder'
                    },
                    cancel: {
                        title: 'Annuler et rejeter tous les changements.',
                        text: 'Annuler'
                    },
                    clearAll: {
                        title: 'Rejeter tous les dessins.',
                        text: 'Rejeter tous'
                    }
                },
                buttons: {
                    edit: 'Éditer les dessins.',
                    editDisabled: 'Aucuns dessins éditables.',
                    remove: 'Supprimer les dessins.',
                    removeDisabled: 'Aucun dessins à supprimer.'
                }
            },
/*
            handlers: {
                edit: {
                    tooltip: {
                        text: 'Glisser les ancres ou le marqueur pour éditer le dessin.',
                        subtext: 'Cliquer sur annuler pour rejeter les changements.'
                    }
                },
                remove: {
                    tooltip: {
                        text: 'Cliquer sur un dessin pour supprimer'
                    }
                }
            }
*/
        }
    }
}

export default drawLocalConfig