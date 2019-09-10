import React from 'react'
import {Link} from "react-router"

import {Footer} from './footer.jsx'

import {SITE_PATH} from '../../config.jsx'

export const ErrorPage = () => (
    <div>
      <div className="error-page">
          <div className="hk-header hk-header--shrink">
              <Link to={SITE_PATH}><img src={`/static/img/Logo_Hikster_Beta-01--blanc.png`} alt=""/></Link>
          </div>
          <h3>404 page not found</h3>
          <p>Something went wrong. We are very sorry about this. Please try again later.<a href={SITE_PATH}> Go back to Homepage.</a></p>
      </div>
      
      <Footer />
    </div>


)
