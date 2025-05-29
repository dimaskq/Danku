// app/about/page.tsx
import Image from "next/image";
import "./about.css";

const About: React.FC = () => {
  return (
    <main className="about">
      <div className="about__profile">
        <div className="about__photo-wrapper">
          <Image
            src="/images/profile-photo.jpg"
            alt="Кравченко Дмитро Олексійович"
            className="about__photo"
          />
        </div>

        <div className="about__info">
          <h1 className="about__name">Дипломна робота</h1>
          <p className="about__text">
            На тему: "Веб застосунок для покращення знань користувача з
            математики і англійської мови" <br /> Студента 4 курсу групи Кі-1-21
            <br />
            Кравченка Дмитра
          </p>
          <p className="about__text">
            ВСП Павлоградський фаховий коледж НТУ ДП
          </p>
        </div>
      </div>
    </main>
  );
};

export default About;
