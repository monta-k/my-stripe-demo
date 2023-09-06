import { getFirestore } from '@/backend/lib/firebase-admin/store'
import { Subscription } from '@/backend/model/subscription/subscription'

const subscriptionCollectionName = 'subscription'

export async function getSubscription(userId: string) {
  const firestore = getFirestore()
  const col = firestore.collection(subscriptionCollectionName)
  const snapshot = await col.where('userId', '==', userId).get()
  if (snapshot.empty) {
    return null
  }
  const data = snapshot.docs[0].data()
  return Subscription.reConstruct(
    data.id,
    data.userId,
    data.stripeCustomerId,
    data.stripeSubscriptionId,
    data.stripeBasicPlanSubscriptionItemId,
    data.stripeUsageTokenPlanSubscriptionItemId,
    data.startedAt,
    data.currentPeriodStartedAt,
    data.currentPeriodEndAt
  )
}

export async function saveSubscription(subscription: Subscription) {
  const firestore = getFirestore()
  const col = firestore.collection(subscriptionCollectionName)
  return col.doc(subscription.id).set(JSON.parse(JSON.stringify(subscription)))
}
