import { CheckIcon } from '@heroicons/react/outline';
import { Product } from '@stripe/firestore-stripe-payments';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { loadCheckout } from '../lib/stripe';
import Loader from './Loader';
import Table from './Table';

interface Props {
  products: Product[];
}

const Plans = ({ products }: Props) => {
  const { logout, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[2]);
  const [isBillingLoading, setBillingLoading] = useState(false);

  const subscribeToPlan = () => {
    if (!user) return;

    loadCheckout(selectedPlan?.prices[0].id!);
    setBillingLoading(true);
  };

  return (
    <div>
      <Head>
        <title>Plans</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header className='border-b border-white/10 bg-[#141414]'>
        <Link href='/'>
          <img
            src='https://rb.gy/ulxxee'
            alt='Netflix'
            width={150}
            height={90}
            className='object-contain cursor-pointer'
          />
        </Link>
        <button
          className='text-lg font-medium hover:underline'
          onClick={logout}
        >
          Sign out
        </button>
      </header>

      <main className='max-w-5xl px-5 pb-12 mx-auto transition-all pt-28 md:px-10'>
        <h1 className='mb-3 text-3xl font-medium'>
          나에게 맞는 플랜을 선택하세요
        </h1>
        <ul>
          <li className='flex items-center text-lg gap-x-2'>
            <CheckIcon className='h-7 w-7 text-[#E50914]' />
            원하는 모든 것을 시청하세요. 광고가 없습니다.
          </li>
          <li className='flex items-center text-lg gap-x-2'>
            <CheckIcon className='h-7 w-7 text-[#E50914]' /> 당신만을 위한 추천.
          </li>
          <li className='flex items-center text-lg gap-x-2'>
            <CheckIcon className='h-7 w-7 text-[#E50914]' /> 언제든지 요금제를
            변경하거나 취소하세요.
          </li>
        </ul>
        <div className='flex flex-col mt-4 space-y-4'>
          <div className='flex w-full items-center justify-end self-end md:w-[60%]'>
            {/* justify-end가 여기선 작동 안된다. */}
            {products.map((product) => (
              <div
                className={`planBox ${
                  selectedPlan?.id === product.id ? 'opacity-100' : 'opacity-60'
                }`}
                key={product.id}
                onClick={() => {
                  setSelectedPlan(product);
                }}
              >
                {product.name}
              </div>
            ))}
          </div>
          <Table products={products} selectedPlan={selectedPlan} />

          <button
            // disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && 'opacity-60'
            }`}
            onClick={subscribeToPlan}
          >
            {isBillingLoading ? (
              <Loader color='dark:fill-gray-300' />
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Plans;
