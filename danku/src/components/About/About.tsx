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
            width={200}
            height={200}
            className="about__photo"
          />
        </div>

        <div className="about__info">
          <h1 className="about__name">Кравченко Дмитро Олексійович</h1>
          <p className="about__text">Студент 4 курсу</p>
          <p className="about__text">
            Павлоградський коледж Національного ТУ «Дніпровська політехніка»
          </p>
          <p className="about__text">Це мій дипломний проект</p>
        </div>
      </div>
    </main>
  );
};

export default About;
