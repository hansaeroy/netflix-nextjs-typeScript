import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useRef, useState } from 'react';
import { Movie } from '../typings';
import Thumbnail from './Thumbnail';

interface Props {
  title: string;
  movies: Movie[];
  //파이어베이스 사용할때
  // movie: Movie | DocumentData[];
}

function Row({ title, movies }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  //스크롤 이벤트
  const handleClick = (direction: string) => {
    setIsMoved(true);

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // console.log(rowRef.current!.scrollLeft, rowRef.current!.clientWidth);
  return (
    <div className='h-40 space-y-0.5 md:space-y-2'>
      <h2 className='w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl'>
        {title}
      </h2>
      <div className='relative group md:-ml-2'>
        <ChevronLeftIcon
          className={`absolute top-0 bottom-0 z-40 m-auto transition opacity-0 cursor-pointer left-2 w-9 h-9 hover:scale-125 group-hover:opacity-100 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        />

        {/* 썸네일 */}
        <div
          ref={rowRef}
          className='flex items-center space-x-0.5 md:space-x-2.5 md:p-2 overflow-x-scroll scrollbar-hide
        '
        >
          {movies.map((movie) => (
            <Thumbnail key={movie.id} movie={movie} />
          ))}
        </div>

        <ChevronRightIcon
          className='absolute top-0 bottom-0 z-40 m-auto transition opacity-0 cursor-pointer right-2 w-9 h-9 hover:scale-125 group-hover:opacity-100'
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  );
}

export default Row;
