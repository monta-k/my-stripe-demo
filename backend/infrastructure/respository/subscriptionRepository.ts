import { getFirestore } from '@/backend/lib/firebase-admin/store'
import { Subscription } from '@/backend/model/subscription/subscription'

const subscriptionCollectionName = 'subscription'

export async function saveSubscription(subscription: Subscription) {
  const firestore = getFirestore()
  const col = firestore.collection(subscriptionCollectionName)
  col.doc(subscription.id).set(JSON.parse(JSON.stringify(subscription)))
}
