import Image from 'next/image';
import { useEffect, useState } from 'react';
import { baseUrl } from '../constants/movie';
import { Movie } from '../typings';
import { FaPlay } from 'react-icons/fa';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { useRecoilState } from 'recoil';
import { modalState, movieState } from '../atoms/modalAtom.';

interface Props {
  netflixOriginals: Movie[];
}

const Banner = ({ netflixOriginals }: Props) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState);

  useEffect(() => {
    setMovie(
      netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)]
    );
  }, [netflixOriginals]);

  console.log(movie);
  return (
    <div className='flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12'>
      <div className='absolute top-0 left-0 -z-10 h-[95vh] w-full'>
        <Image
          // next/image를 사용하여 이미지를 불러오기 위해선 반드시 "width" 와 "height" 값이나 "layout='fill'" 값을 사용해야 한다.
          // 바로사용하면 next/image Un-configured Host 에러가 뜨는데
          //
          layout='fill'
          src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
          objectFit='cover'
        />
      </div>
      {/* 타이틀 */}
      <h1 className='text-2xl lg:text-7xl md:text-4xl '>
        {movie?.title || movie?.name || movie?.original_title}
      </h1>
      {/* 설명 */}
      <p className='max-w-xs text-xs text-shadow-md md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl'>
        {movie?.overview}
      </p>

      <div className='flex space-x-3'>
        <button className='text-black bg-white bannerButton'>
          <FaPlay className='w-4 h-4 text-black md:h-7 md:w-7' />
          Play
        </button>
        <button
          className='bannerButton bg-[gray]/70'
          onClick={() => {
            setCurrentMovie(movie);
            setShowModal(true);
          }}
        >
          More Info <InformationCircleIcon className='w-5 h-5 md:h-8 md:w-8' />
        </button>
      </div>
    </div>
  );
};

export default Banner;
