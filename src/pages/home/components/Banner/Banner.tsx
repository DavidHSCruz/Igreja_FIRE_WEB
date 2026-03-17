import { Link } from 'react-router-dom'
import LogoLeao from '../../../../assets/leao.svg?react'
import { YoutubeVideo } from '../YoutubeVideo/YoutubeVideo'
import { Card } from './Card/Card'
import { FaArrowRight } from 'react-icons/fa';

export const Banner = () => {
  return (
    <>
      <section className="flex md:flex-row flex-col-reverse gap-14 justify-center items-center w-5/6 m-auto py-24">
        <div className="text-primary flex flex-col gap-2">
          <span className="md:text-6xl text font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Somos FIRE,</span>
          <h3 className="md:text-6xl font-bold text-4xl">uma igreja VIVA.</h3>
          <p className="my-2 font-medium opacity-90">Faça parte dessa família.</p>
        </div>
        <div className='flex justify-center w-2/4 flex-grow-0'>
          <Card className='min-w-[320px] w-full aspect-[16/9]'>
            <YoutubeVideo embedID="kx7oSyxGVY8"/>
          </Card>
        </div>
      </section>
      <section className="bg-primary w-full flex justify-center">
        <div className="flex items-center justify-center gap-5 py-24 w-5/6">
          <Card className="md:flex md:h-80 hidden min-w-[190px] max-w-full md:max-w-[550px] h-60 w-full justify-center items-center bg-[url('/img/imagem1.jpg')] bg-cover bg-center">
          </Card>
          <div className=" grid-cols-2 flex w-3/4 gap-4">
            <div className="col-start-1 flex justify-end items-center w-full overflow-hidden">
              <LogoLeao className=" h-60 flex-none translate-x-1/2 text-secondary"/>
            </div>
            <div className="text-quaternary col-start-2 min-w-56 max-w-lg mt-4">
              <h2 className="text-6xl mb-4">O que é ser <strong className="border-b-2 text-red-500 border-secondary border-opacity-20">FIRE?</strong></h2>
              <p className="text-2xl text-quaternary opacity-80">
                Ser FIRE é ter em si uma chama que contagia e transforma sua realidade de dentro para fora.
              </p>
              <div className="pt-2">
                <Link 
                  to='/historia' 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-red-700 text-primary rounded-full font-bold transition-all shadow-lg shadow-secondary/20"
                >
                  Saiba mais
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
