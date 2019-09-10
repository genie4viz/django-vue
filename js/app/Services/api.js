import axios from "axios"

const api = {
    fetchSearch: config => {
      return axios(config)
      .then(res => res)
      .catch(err => err)
    },
    fetchShowcase: () => {
        return axios.get("/trails/showcase/", {
            params: {
                "expand": "images"
            },
            responseType: "json",
            timeout: 20000
        }).then(res => {
            return res
        }).catch(error => {
            return error
        })
    },
    fetchPage: link => {
        return axios.get(link, {
                responseType: "json",
                timeout: 200000,
                validateStatus: (status) => {
                    return status < 500
                }
            })
            .then((res) => {
                return res
            })
            .catch((err) => {
                if (err.results === 2153644038) {
                    return;
                }
                return err
            })
    },
    fetchHike: id => {
        return axios.get(`/trails/${id}/`, {
            params: {
                "expand": "location,location.address,images,trail_sections"
            },
            responseType: "json",
            timeout: 20000
        }).then(res => {
            return res
        }).catch(error => {
            return error
        })
    },
    fetchTrailsection: id => {
      return axios.get(`/trailsections/${id}`, {
        responseType: "json",
        timeout: 20000
      }).then(res => {
        return res
      }).catch(err => {
        return err
      })
    },
    /**
     * Asyc action creator to fetch hike network data from API
     * @param  {string} id The id of the resource to fetch. Ex: location/1
     * @return {function}     async call to the API
     */
    fetchHikeNetwork: id => {
        const _getNetworkDetails = id => {
            return axios.get(`/locations/${id}/`, {
                params: {
                    "expand": "contact,images"
                },
                responseType: "json",
                timeout: 200000,
                validateStatus: (status) => {
                    return status < 500
                }
            })
        },
        _getNetworkTrails = id => {
            return axios.get(`/locations/${id}/trails/`, {
                params: {
                    "include": "id,name,total_length,difficulty,path_type,trail_sections,shape,activity",
                    "expand": "trail_sections"
                },
                responseType: "json",
                timeout: 200000,
                validateStatus: (status) => {
                    return status < 500
                }
            })
        }
        return axios.all([
                /**
                 * Helper methode to fetch network details concurrently
                 * @param  {string}   id the id of the hike to get
                 * @return {function}    asyc function
                 */
                _getNetworkDetails(id),
                _getNetworkTrails(id)
            ])
            .then(res => {
                return res
            })
            .catch((err) => {
                return err
            })
    },
    postFacebookRequest: me => {
        return axios.post("/rest-auth/facebook/", {
            access_token: me.accessToken
        }, {
            validateStatus: (status) => {
                return status < 500
            }
        }).then((res) => {
            return res
        }).catch((error) => {
            return errror
        })
    },
    postLoginRequest: formData => {
        return axios({
            method: "post",
            url: "/rest-auth/login/",
            params: {
                expand: "address,phone_number"
            },
            data: formData
        }).then((res) => {
            return res
        }).catch((error) => {
            return error
        })
    },
    postRegisterRequest: formData => {
        return axios.post("/rest-auth/registration/", formData)
            .then((res) => {
                return res
            }).catch((error) => {
                return error
            })
    },
    postLogout: accessToken => {
        return axios.post("/rest-auth/logout/", {
                token: accessToken
            })
            .then(reponse => {
                return res
            })
            .catch(error => {
                return error
            })
    },
    postRefreshToken: oldToken => {
        return axios.post("/refresh-token/",
        {
            token: oldToken
        })
        .then(res => {
            return res
        })
        .catch(error => {
            return error
        })
    },
    postVerifyToken: token => {
        return axios({
            method: 'post',
            url: '/verify-token/',
            data: {
                token: token
            },
            params: {
                expand: 'address,phone_number'
            }
        })
        .then(res => {
            return res
        })
        .catch(error => {
            return error
        })
    },

    getUserTrails: config => {
        return axios(config)
        .then(res => res)
        .catch(err => err)
    },

    getUserLocations: config => {
        return axios(config)
        .then(res => res)
        .catch(err => err)
    },

    getUserTrailSectionsByLocations: config => {
        return axios(config)
        .then(res => res)
        .catch(err => err)
    },

    getFilteredTrails: config => {
      return axios(config)
      .then(res => res)
      .catch(err => err)
    },

    getAdmins: config => {
      return axios(config)
      .then(res => res)
      .catch(err => err)
    },
    getShape: config => {
        return axios(config)
    },
    makeFetchRequest: config => {
        return axios(config)
        .then(res => res)
        .catch(err => err)
    },
    makeUpdateRequest: config => {
      return axios(config)
      .then(res => res)
      .catch(err => err)
    },
    makeCreateRequest: config => {
        return axios(config)
        .then(res => res)
        .catch(err => err)
    },
    makeDeleteRequest: config => {
        return axios(config)
        .then(res => res)
        .catch(err => err)
    }
}

export default api
