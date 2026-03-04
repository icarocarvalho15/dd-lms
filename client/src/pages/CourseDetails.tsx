import { useParams } from 'react-router-dom';

const CourseDetails = () => {
    const { slug } = useParams();

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Sala de Aula</h1>
            <p>Você está acessando o curso: <span className="text-blue-600 font-mono">{slug}</span></p>
        </div>
    );
};

export default CourseDetails;