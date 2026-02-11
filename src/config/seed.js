const seedDatabase = async (models) => {
  try {
    const { Course, Module } = models;

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
        description: "Objetivo, acompañamiento, calma y límites en PAE.",
        order_index: 1,
        duration: "3:47",
        courseId: course.id, // Usamos la FK del curso encontrado/creado
        videoId: "eXZL2x4-3Ls"
      },
      {
        title: "Prepararse para acompañar en medio del caos",
        description: "Cuidar al cuidador y técnicas de observación antes de intervenir.",
        order_index: 2,
        duration: "3:27",
        courseId: course.id,
        videoId: "phr_Iu2XfxI"
      },
      {
        title: "Escuchar con el corazón, apoyar con la presencia",
        description: "Técnicas de empatía, validación y manejo de reacciones intensas.",
        order_index: 3,
        duration: "3:31",
        courseId: course.id,
        videoId: "hRzZ_b9SVb4"
      }
    ];

    // Insertar módulos (Solo si el curso fue recién creado o usando lógica de validación)
    // Usamos un loop o bulkCreate con validación para no duplicar por título
    for (const mod of modulesData) {
      await Module.findOrCreate({
        where: { videoId: mod.videoId },
        defaults: mod
      });
    }

    console.log('🚀 Módulos sincronizados correctamente.');
  } catch (error) {
    console.error('❌ Error al sembrar la base de datos:', error);
  }
};

module.exports = seedDatabase;