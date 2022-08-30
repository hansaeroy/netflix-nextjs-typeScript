import {
  createCheckoutSession,
  getStripePayments,
} from '@stripe/firestore-stripe-payments';
import { getFunctions, httpsCallable } from '@firebase/functions';
import app from '../firebase';

const payments = getStripePayments(app, {
  productsCollection: 'products',
  customersCollection: 'customers',
});

export const loadCheckout = async (priceId: string) => {
  await createCheckoutSession(payments, {
    price: priceId,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  })
    .then((snapshot) => window.location.assign(snapshot.url))
    .catch((error) => console.log(error.message));
};

export const goToBillingPotal = async () => {
  const instance = getFunctions(app, 'asia-northeast1'); //'asia-northeast1는 데이터베이스 위치(파이어베이스 extension의 관리 -> 작동방식 하단쪽에 customers potal을 보면 나옴)
  const functionRef = httpsCallable(
    instance,
    'ext-firestore-stripe-payments-createPortalLink'
  );

  await functionRef({
    returnUrl: `${window.location.origin}/account`,
  })
    .then(({ data }: any) => window.location.assign(data.url))
    .catch((error) => console.log(error.message));

  //다른 방식
  //  const functionRef = firebase
  //   .app()
  //   .functions('asia-northeast1')
  //   .httpsCallable('ext-firestore-stripe-payments-createPortalLink');
  // const { data } = await functionRef({
  //   returnUrl: window.location.origin,
  //   locale: "auto", // Optional, defaults to "auto"
  //   configuration: "bpc_1JSEAKHYgolSBA358VNoc2Hs", // Optional ID of a portal configuration: https://stripe.com/docs/api/customer_portal/configuration
  // });
  // window.location.assign(data.url);
};

export default payments;

//아래는 스트라이프 유틸리티를 사용하지 않은 방식
//손볼꺼는 많은데 비교해보라고 붙여놓기 했음

// import { db } from '../firebase';
// import { collection, addDoc, onSnapshot } from 'firebase/firestore';

// const loadCheckouts = async (priceId: string) => {
//   const customers = collection(db, 'customers', user.uid, 'checkout_sessions');
//   const docRef = await addDoc(customers, {
//     price: priceId,
//     success_url: window.location.origin,
//     cancel_url: window.location.origin,
//   });

//   onSnapshot(docRef, async (snap) => {
//     const { error, sessionId } = snap.data();

//     if (error) {
//       //고객에게 팝업으로 오류를 보내주고
//       //파이어베이스 콘솔로 무엇이 잘못되어있는지 로그를 검사하라
//       alert(`An error occurred: ${error.message}`);
//     }

//     if (sessionId) {
//       //세션이 있음, checkout을 redirect하자
//       //Stripe 초기화

//       const stripe = await loadStripe(
//         'API keys들어가는 자리'
//       );
//       stripe.redirectToCheckout({ sessionId });
//     }
//   });
// };
