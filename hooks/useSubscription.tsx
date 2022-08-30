import { useEffect, useState } from 'react';
import {
  onCurrentUserSubscriptionUpdate,
  Subscription,
} from '@stripe/firestore-stripe-payments';
import payments from '../lib/stripe';
import { User } from 'firebase/auth';

function useSubscription(user: User | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (!user) return;

    onCurrentUserSubscriptionUpdate(payments, (snapshot) => {
      setSubscription(
        snapshot.subscriptions.filter(
          (subscription) =>
            subscription.status === 'active' ||
            subscription.status === 'trialing'
        )[0]
      );
    });
  }, [user]);

  return subscription;
}

export default useSubscription;

//다른 방식
// import db from '../store/firebase';
// import { useSelector } from 'react-redux';
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   onSnapshot,
// } from 'firebase/firestore';
// import { useEffect, useState } from 'react';
// import { selectUser } from '../store/userSlice';
// import { loadStripe } from '@stripe/stripe-js';
// useEffect(() => {
//   const getSub = async () => {
//     const subRef = collection(db, 'customers', user.uid, 'subscriptions');
//     const querySnapshot = await getDocs(subRef);

//     // console.log(querySnapshot);

//     querySnapshot.forEach(async (subscription) => {
//       setSubscription({
//         role: subscription.data().role,
//         current_period_end: subscription.data().current_period_end.seconds,
//         currrent_period_start: subscription.data().currrent_period_start,
//       });
//     });
//   };

//   getSub();
// }, [user.uid]);
