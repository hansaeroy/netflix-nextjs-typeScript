import {
  CheckIcon,
  PlusIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from '@heroicons/react/outline';
import MuiModal from '@mui/material/Modal';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaPlay } from 'react-icons/fa';
import ReactPlayer from 'react-player/lazy';
import { useRecoilState } from 'recoil';
import { modalState, movieState } from '../atoms/modalAtom.';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { Element, Genre, Movie } from '../typings';

const Modal = () => {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [muted, setMuted] = useState(true);
  const { user } = useAuth();
  const [addedToList, setAddedToList] = useState(false);
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);

  const toastStyle = {
    background: 'white',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '15px',
    borderRadius: '9999px',
    maxWidth: '1000px',
  };

  useEffect(() => {
    if (!movie) return;

    async function fetchMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === 'tv' ? 'tv' : 'movie'
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      ).then((response) => response.json());

      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === 'Trailer'
        );
        setTrailer(data.videos?.results[index]?.key);
      }

      if (data?.genres) {
        setGenres(data.genres);
      }
    }

    fetchMovie();
  }, [movie]);

  // console.log(trailer);

  const handleClose = () => {
    setShowModal(false);
  };

  // Find all the movies in the user's list
  useEffect(() => {
    if (user) {
      return onSnapshot(
        collection(db, 'customers', user.uid, 'myList'),
        (snapshot) => setMovies(snapshot.docs)
      );
    }
  }, [db, movie?.id]);

  // Check if the movie is already in the user's list
  useEffect(
    () =>
      setAddedToList(
        movies.findIndex((result) => result.data().id === movie?.id) !== -1
        //찾는 값이 -1이랑 같지않으면 참을 반환한다.
        //찾는 값이 있으면 -1이 아니니까 참이고 , 찾는값이 없으면 -1이라서 -1 == -1이라 false가 된다.
      ),
    [movies]
  );

  const handleList = async () => {
    if (addedToList) {
      await deleteDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!)
      );
      toast(
        `${movie?.title || movie?.original_name} has been removed for My List`,
        { duration: 8000, style: toastStyle }
      );
    } else {
      await setDoc(
        doc(db, 'customers', user!.uid, 'myList', movie?.id.toString()!),
        { ...movie }
      );
      toast(
        `${movie?.title || movie?.original_name} has been added to My List`,
        { duration: 8000, style: toastStyle }
      );
    }
  };

  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      className='fixed !top-7 right-0 left-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll scrollbar-hide rounded-md'
    >
      <>
        <Toaster position='bottom-center' />
        <button
          onClick={handleClose}
          className='modalButton absolute right-5 top-5 !z-40 w-9 h-9 border-none bg-[#181818] hover:bg-[#181818]'
        >
          <XIcon className='w-6 h-6' />
        </button>
        <div className='relative pt-[56.25%]'>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width='100%'
            height='100%'
            style={{ position: 'absolute', top: '0', left: '0' }}
            playing
            muted={muted}
          />
          <div className='absolute flex items-center justify-between w-full px-10 bottom-10'>
            <div className='flex space-x-2'>
              <button className='flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]'>
                <FaPlay className='flex h-6 text-black w-7' />
                play
              </button>
              <button className='modalButton' onClick={handleList}>
                {addedToList ? (
                  <CheckIcon className='h-7 w-7' />
                ) : (
                  <PlusIcon className='h-7 w-7' />
                )}
              </button>
              <button className='modalButton'>
                <ThumbUpIcon className='h-7 w-7' />
              </button>
            </div>
            <button className='modalButton' onClick={() => setMuted(!muted)}>
              {muted ? (
                <VolumeOffIcon className='w-6 h-6' />
              ) : (
                <VolumeUpIcon className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>
        <div className='flex space-x-16 bg-[#181818] rounded-b-md px-10 py-8'>
          <div className='space-y-6 text-lg'>
            <div className='flex items-center space-x-2 text-sm'>
              <p className='font-semibold text-green-400'>
                {movie!.vote_average * 10}% Match
              </p>
              <p>{movie?.release_date || movie?.first_air_date}</p>
              <div className='flex items-center justify-center h-4 border rounded border-white/10 px-1.5 text-xs'>
                HD
              </div>
            </div>

            <div className='flex flex-col font-light gap-x-10 gap-y-4 md:flex-row'>
              <p className='w-5/6'>{movie?.overview}</p>
              <div className='flex flex-col space-y-3 text-sm'>
                <div>
                  <span className='text-[gray]'>Genres: </span>
                  {genres.map((genre) => genre.name).join(', ')}
                </div>
                <div>
                  <span className='text-[gray]'>Original language :</span>
                  {movie?.original_language}
                </div>
                <div>
                  <span className='text-[gray]'>Total votes :</span>
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  );
};

export default Modal;
