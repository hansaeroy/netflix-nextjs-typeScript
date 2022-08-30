import { CheckIcon } from '@heroicons/react/outline';
import { Product } from '@stripe/firestore-stripe-payments';
import React from 'react';

interface Props {
  products: Product[];
  selectedPlan: Product | null;
}

function Table({ products, selectedPlan }: Props) {
  return (
    <table>
      <tbody className='divide-y divide-[gray]'>
        <tr className='tableRow '>
          <td className='tableDataTitle'>월별 가격</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? 'text-[#f55f67]'
                  : 'text-[gray]'
              }`}
              key={product.id}
            >
              {product.prices[0].unit_amount}원
            </td>
          ))}
        </tr>
        <tr className='tableRow '>
          <td className='tableDataTitle'>비디오 품질</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? 'text-[#f55f67]'
                  : 'text-[gray]'
              }`}
              key={product.id}
            >
              {product.metadata.videoQuality}
            </td>
          ))}
        </tr>
        <tr className='tableRow '>
          <td className='tableDataTitle'>해상도</td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? 'text-[#f55f67]'
                  : 'text-[gray]'
              }`}
              key={product.id}
            >
              {product.metadata.resolution}
            </td>
          ))}
        </tr>
        <tr className='tableRow'>
          <td className='tableDataTitle'>
            TV, 컴퓨터, 휴대전화 및 태블릿에서 시청
          </td>
          {products.map((product) => (
            <td
              className={`tableDataFeature ${
                selectedPlan?.id === product.id
                  ? 'text-[#f55f67]'
                  : 'text-[gray]'
              }`}
              key={product.id}
            >
              {product.metadata.portability === 'true' && (
                <CheckIcon className='inline-block w-8 h-8' />
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default Table;
