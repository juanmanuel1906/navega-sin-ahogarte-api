const { Course, Module, Question, Option, UserModuleProgress } = require('../models');

exports.getAllCourses = async (req, res) => {
    // Asumimos que tienes el ID del usuario en req.user.id (por el token)
    const currentUserId = req.user ? req.user.id : null;

    try {
        const courses = await Course.findAll({
            include: [{
                model: Module,
                as: 'modules',
                include: [
                    // Incluimos las preguntas (para el quiz)
                    {
                        model: Question,
                        as: 'questions',
                        include: [{ model: Option, as: 'options' }]
                    },
                    // Incluir el progreso SOLO de este usuario
                    {
                        model: UserModuleProgress,
                        as: 'userProgress',
                        required: false, // LEFT JOIN (trae el módulo aunque no tenga progreso)
                        where: { userId: currentUserId } // Filtrar solo progreso de este usuario
                    }
                ]
            }],
            order: [
                ['id', 'ASC'],
                [{ model: Module, as: 'modules' }, 'order_index', 'ASC']
            ]
        });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error server" });
    }
};

exports.getModulesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const modules = await Module.findAll({ where: { courseId } });
        res.json(modules);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener módulos" });
    }
};

// Usuario da Play
exports.startVideo = async (req, res) => {
    const userId = req.user.id;
    const moduleId = req.params.id;
    
    try {
        let progress = await UserModuleProgress.findOne({ where: { userId, moduleId } });
        
        if (!progress) {
            // PRIMERA VEZ: Creamos el registro
            progress = await UserModuleProgress.create({
                userId,
                moduleId,
                video_started_at: new Date() 
            });
        } else {
            // CORRECCIÓN CRÍTICA:
            // Solo actualizamos la fecha si NO existía una fecha de inicio previa
            // o si el video ya se había completado antes y lo están repitiendo.
            if (!progress.video_started_at) {
                 progress.video_started_at = new Date();
                 await progress.save();
            }
            // Si ya tiene fecha, NO la tocamos. Así respetamos el momento en que dio Play por primera vez.
        }

        res.json({ message: "Timer verificado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al iniciar video" });
    }
};

// Usuario termina video
exports.completeVideo = async (req, res) => {
    const userId = req.user.id;
    const moduleId = req.params.id;

    try {
        const module = await Module.findByPk(moduleId);
        const progress = await UserModuleProgress.findOne({ where: { userId, moduleId } });

        if (!progress || !progress.video_started_at) {
            return res.status(400).json({ error: "No has iniciado el video (Timer no encontrado)" });
        }

        // --- LÓGICA DE VALIDACIÓN DE TIEMPO ---
        const now = new Date();
        const startTime = new Date(progress.video_started_at);
        // Diferencia en segundos
        const secondsElapsed = (now.getTime() - startTime.getTime()) / 1000;

        // Margen de tolerancia (ej: 10 segundos por lag de red)
        const minTimeRequired = module.video_duration_seconds - 10;

        if (secondsElapsed < minTimeRequired) {
            return res.status(403).json({
                error: `Solo han pasado ${Math.floor(secondsElapsed)} segundos. Debes ver el video completo.`
            });
        }

        // Si pasa la validación, actualizamos
        progress.video_completed = true;
        await progress.save();

        res.json({ success: true, message: "Video verificado. Quiz desbloqueado." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al verificar video" });
    }
};

// Guardar nota del Quiz
exports.submitQuizProgress = async (req, res) => {
    const userId = req.user.id;
    const moduleId = req.params.id;
    const { score } = req.body; // Recibimos el puntaje (0 a 100)

    try {
        let progress = await UserModuleProgress.findOne({ where: { userId, moduleId } });

        if (!progress) {
            return res.status(404).json({ error: "Progreso no encontrado. Debes ver el video primero." });
        }

        // Guardamos el puntaje más alto (si lo repite)
        if (score > progress.quiz_score) {
            progress.quiz_score = score;
        }

        // Lógica de Aprobación: Si saca 60 o más, se marca completado
        const PASSED_SCORE = 60; 
        
        if (score >= PASSED_SCORE) {
            progress.is_completed = true;
            await progress.save();
            return res.json({ 
                success: true, 
                passed: true, 
                message: "¡Módulo aprobado y completado!" 
            });
        } else {
            await progress.save(); // Guardamos el intento aunque fallara
            return res.json({ 
                success: true, 
                passed: false, 
                message: "Puntaje guardado, pero no suficiente para aprobar." 
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar quiz" });
    }
};