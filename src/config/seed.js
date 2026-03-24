const seedDatabase = async (models) => {
  try {
    const { Course, Module, Question } = models;

    // Crear el Curso si no existe
    const [course, created] = await Course.findOrCreate({
      where: { title: 'Conviértete en Salva' },
      defaults: {
        description: 'Aprende las herramientas fundamentales de los Primeros Auxilios Emocionales (PAE) para acompañar a otros en momentos de crisis, promoviendo la calma y el bienestar digital.',
        cover_url: ''
      }
    });

    if (created) {
      console.log('✅ Curso "Conviértete en Salva" creado exitosamente.');
    }

    // Datos de los módulos vinculados al ID del curso creado
    const modulesData = [
      {
        title: "Encender la chispa de los Primeros Auxilios Emocionales",
        description: "Preguntas de comprensión sobre el objetivo, acompañamiento, calma y límites en PAE.",
        videoId: "eXZL2x4-3Ls",
        duration: "3:00",
        order_index: 1,
        courseId: course.id, // Usamos la FK del curso encontrado/creado
        questions: [
          {
            question_text: "¿Cuál es el objetivo principal de los Primeros Auxilios Emocionales (PAE)?",
            options: [
              { option_text: "Brindar terapia psicológica profunda.", is_correct: false },
              { option_text: "Acompañar a una persona en crisis desde la contención y la escucha.", is_correct: true }, // ✅
              { option_text: "Diagnosticar trastornos mentales.", is_correct: false },
              { option_text: "Enseñar estrategias de afrontamiento a largo plazo.", is_correct: false }
            ]
          },
          {
            question_text: "¿Qué caracteriza la acción de “acompañar” en una crisis?",
            options: [
              { option_text: "Dar consejos y soluciones rápidas.", is_correct: false },
              { option_text: "Mostrar presencia empática y validar las emociones.", is_correct: true }, // ✅
              { option_text: "Evitar que la persona exprese su dolor.", is_correct: false },
              { option_text: "Distraer al otro para que se olvide del problema.", is_correct: false }
            ]
          },
          {
            question_text: "Según los principios de los PAE, ¿cuál de las siguientes acciones representa calma?",
            options: [
              { option_text: "Hablar rápido para mantener la atención.", is_correct: false },
              { option_text: "Respirar profundo, mantener un tono de voz estable y pausado.", is_correct: true }, // ✅
              { option_text: "Hacer múltiples preguntas para obtener detalles.", is_correct: false },
              { option_text: "Evitar el contacto visual.", is_correct: false }
            ]
          },
          {
            question_text: "¿Cuál de las siguientes afirmaciones refleja un límite adecuado del acompañante?",
            options: [
              { option_text: "Intentar resolver el problema completamente.", is_correct: false },
              { option_text: "Derivar a un profesional cuando hay riesgo grave o persistente.", is_correct: true }, // ✅
              { option_text: "Permanecer todo el tiempo con la persona hasta que se sienta bien.", is_correct: false },
              { option_text: "Diagnosticar la causa del malestar.", is_correct: false }
            ]
          },
        ]
      },
      {
        title: "Prepararse para acompañar en medio del caos",
        description: "Cuidar al cuidador y técnicas de observación antes de intervenir.",
        videoId: "phr_Iu2XfxI",
        duration: "3:27",
        courseId: course.id,
        order_index: 2,
        questions: [
          {
            question_text: "¿Qué significa “cuidar al cuidador”?",
            options: [
              { option_text: "Asegurarse de no involucrarse emocionalmente con nadie.", is_correct: false },
              { option_text: "Reconocer las propias emociones y mantener autorregulación antes de ayudar.", is_correct: true }, // ✅
              { option_text: "Desconectarse por completo del contexto de la crisis.", is_correct: false },
              { option_text: "Aplicar técnicas sin considerar el propio estado emocional.", is_correct: false }
            ]
          },
          {
            question_text: "Antes de intervenir en una crisis, el acompañante debe:",
            options: [
              { option_text: "Acercarse rápidamente para tomar el control.", is_correct: false },
              { option_text: "Observar el entorno y garantizar la seguridad.", is_correct: true }, // ✅
              { option_text: "Dar indicaciones de inmediato.", is_correct: false },
              { option_text: "Pedir a otros que se retiren sin evaluar riesgos.", is_correct: false }
            ]
          },
          {
            question_text: "En el modelo Mirar, Escuchar y Conectar, la fase de “Escuchar” implica:",
            options: [
              { option_text: "Aconsejar y ofrecer soluciones prácticas.", is_correct: false },
              { option_text: "Validar emociones y permitir expresión sin interrupciones.", is_correct: true }, // ✅
              { option_text: "Evaluar la veracidad de lo que dice la persona.", is_correct: false },
              { option_text: "Mantener silencio absoluto.", is_correct: false }
            ]
          },
          {
            question_text: "¿Qué recurso interno del acompañante favorece una intervención eficaz?",
            options: [
              { option_text: "Su conocimiento técnico exclusivamente.", is_correct: false },
              { option_text: "Su capacidad de regularse emocionalmente frente al dolor ajeno.", is_correct: true }, // ✅
              { option_text: "Su autoridad sobre la situación.", is_correct: false },
              { option_text: "Su rapidez al actuar.", is_correct: false }
            ]
          }
        ]
      },
      {
        title: "Escuchar con el corazón, apoyar con la presencia",
        description: "Técnicas de empatía, validación y manejo de reacciones intensas.",
        video_url: "hRzZ_b9SVb4",
        duration: "3:31",
        courseId: course.id,
        order_index: 3,
        questions: [
          {
            question_text: "Escuchar con el corazón significa:",
            options: [
              { option_text: "Analizar el discurso de la persona para identificar errores cognitivos.", is_correct: false },
              { option_text: "Estar plenamente presente, sin juicios ni interrupciones.", is_correct: true }, // ✅
              { option_text: "Permanecer en silencio sin mostrar empatía.", is_correct: false },
              { option_text: "Hablar de experiencias personales para tranquilizar al otro.", is_correct: false }
            ]
          },
          {
            question_text: "¿Qué elemento NO pertenece a la comunicación empática?",
            options: [
              { option_text: "Tono de voz suave y postura abierta.", is_correct: false },
              { option_text: "Validación emocional del otro.", is_correct: false },
              { option_text: "Lenguaje corporal tenso o cerrado.", is_correct: true }, // ✅
              { option_text: "Escucha activa.", is_correct: false }
            ]
          },
          {
            question_text: "¿Qué debe hacer el acompañante ante una reacción intensa (llanto, enojo, silencio)?",
            options: [
              { option_text: "Forzar a la persona a calmarse.", is_correct: false },
              { option_text: "Permitir la expresión emocional y acompañar sin juzgar.", is_correct: true }, // ✅
              { option_text: "Retirarse para evitar involucrarse.", is_correct: false },
              { option_text: "Hablar rápidamente para distraerla.", is_correct: false }
            ]
          },
          {
            question_text: "En contextos culturalmente diversos, el acompañante debe:",
            options: [
              { option_text: "Aplicar las mismas técnicas a todos por igual.", is_correct: false },
              { option_text: "Respetar creencias y formas de expresión distintas.", is_correct: true }, // ✅
              { option_text: "Evitar hablar de las emociones.", is_correct: false },
              { option_text: "Corregir las ideas culturales que no comparte.", is_correct: false }
            ]
          }
        ]
      },
      /*
      {
        title: "Reconectar a la persona con la vida y sus redes",
        description: "Estrategias de cierre, reconexión y derivación profesional.",
        video_url: "9_xMB65_86w",
        video_duration_seconds: 360,
        order_index: 4,
        questions: [
          {
            question_text: "¿Cuál es el objetivo principal en la fase de “reconexión”?",
            options: [
              { option_text: "Lograr que la persona no vuelva a pensar en la crisis.", is_correct: false },
              { option_text: "Reintegrarla con sus redes personales, comunitarias y de apoyo.", is_correct: true }, // ✅
              { option_text: "Asegurarse de que dependa del acompañante.", is_correct: false },
              { option_text: "Terminar rápidamente el proceso.", is_correct: false }
            ]
          },
          {
            question_text: "Promover la fortaleza interior significa:",
            options: [
              { option_text: "Recordar a la persona sus recursos y experiencias previas de superación.", is_correct: true }, // ✅
              { option_text: "Convencerla de que el problema no es tan grave.", is_correct: false },
              { option_text: "Minimizar su malestar para que se distraiga.", is_correct: false },
              { option_text: "Indicarle cómo debería reaccionar.", is_correct: false }
            ]
          },
          {
            question_text: "¿Cuándo se debe derivar a un profesional especializado?",
            options: [
              { option_text: "Cuando la persona lo solicita.", is_correct: false },
              { option_text: "Cuando hay riesgo suicida, síntomas graves o violencia persistente.", is_correct: true }, // ✅
              { option_text: "Solo si no se dispone de tiempo para acompañar.", is_correct: false },
              { option_text: "Cuando la persona se niega a hablar.", is_correct: false }
            ]
          },
          {
            question_text: "Las redes familiares y comunitarias son importantes porque:",
            options: [
              { option_text: "Sustituyen la ayuda profesional.", is_correct: false },
              { option_text: "Facilitan la recuperación emocional y previenen el aislamiento.", is_correct: true }, // ✅
              { option_text: "Evitan que la persona busque apoyo externo.", is_correct: false },
              { option_text: "Permiten que otros tomen decisiones por ella.", is_correct: false }
            ]
          }
        ]
      }*/
    ];

    // Insertar módulos (Solo si el curso fue recién creado o usando lógica de validación)
    // Usamos un loop o bulkCreate con validación para no duplicar por título
    for (const mod of modulesData) {
      await Module.findOrCreate({
        where: { videoId: mod.videoId },
        defaults: mod,
        courseId: course.id
      });

      if (mod.questions) {
        for (const qData of mod.questions) {
          // Crear/Buscar Pregunta
          const [question] = await Question.findOrCreate({
            where: { 
              moduleId: module.id, 
              text: qData.text 
            }
          });

          // Crear/Buscar Opciones para esa pregunta
          for (const optData of qData.options) {
            await Option.findOrCreate({
              where: { 
                questionId: question.id, 
                option_text: optData.option_text
              },
              defaults: {
                isCorrect: optData.is_correct
              },
            });
          }

        }
      }
    }

    console.log('🚀 Módulos sincronizados correctamente.');
  } catch (error) {
    console.error('❌ Error al sembrar la base de datos:', error);
  }
};

module.exports = seedDatabase;