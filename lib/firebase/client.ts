import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebase: FirebaseApp = !getApps().length ? initializeApp(require('./firebase.client.key.json')) : getApp()

const auth = getAuth()

export { firebase, auth }
