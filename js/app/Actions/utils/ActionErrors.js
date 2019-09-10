import { SubmissionError } from 'redux-form'

export class AccessTokenError extends Error {
    constructor(message) {
        super(message)
        this.message = message
        this.name = "AccessTokenError"
    }
}

export class BadApiResponseError extends Error {
    constructor(message) {
        super(message)
        this.message = message
        this.name = "BadApiResponseError"
    }
}

export const checkResponse = response => {
    if (response && response.status > 400) {
        throw new BadApiResponseError(`Erreur ${response.status}: ${response.statusText} - ${response.data.detail}`)
    } else if (response && response.status === 400) {
        throw new Error("Problème lors de la connexion. Verifiez votre nom d'utilisateur ou mot de passe.")
    }
}

export const checkToken = token => {
    if (!token) throw new AccessTokenError("")
}