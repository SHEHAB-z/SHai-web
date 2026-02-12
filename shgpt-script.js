// State Management
let currentSubject = 'all';
let chatHistory = [];
let currentTheme = 'light';
let pdfData = {};
let smartEngine = null; // محرك البحث الذكي

// PDF.js configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// تهيئة محرك البحث الذكي
document.addEventListener('DOMContentLoaded', () => {
    if (typeof SmartSearchEngine !== 'undefined') {
        smartEngine = new SmartSearchEngine(knowledgeBase);
        console.log('✅ تم تفعيل النظام الذكي!');
    }
});

// PDF Files Configuration
// يمكنك استخدام ملفات محلية أو روابط خارجية (Google Drive, Dropbox, etc.)
const pdfFiles = {
    physics: 'pdfs/physics.pdf',  // أو ضع رابط Google Drive
    chemistry: 'pdfs/chemistry.pdf',
    math: ['pdfs/math1.pdf', 'pdfs/math2.pdf'],
    arabic: ['pdfs/arabic1.pdf', 'pdfs/arabic2.pdf', 'pdfs/arabic3.pdf'],
    biology: 'pdfs/biology.pdf',
    engineering: 'pdfs/engineering.pdf',
    islamic: 'pdfs/islamic.pdf',
    geography: 'pdfs/geography.pdf',
    history: 'pdfs/history.pdf'
};

// مثال لاستخدام روابط خارجية:
// physics: 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID',

// Subject Knowledge Base
const subjectKnowledge = {
    math: {
        name: 'الرياضيات',
        topics: ['الجبر', 'الهندسة التحليلية', 'التفاضل والتكامل', 'الإحصاء', 'المثلثات', 'الأعداد المركبة'],
        tips: 'تذكر دائماً أن تتحقق من وحدات القياس وأن تكتب الخطوات بوضوح'
    },
    engineering: {
        name: 'الهندسة',
        topics: ['الهندسة المستوية', 'الهندسة الفراغية', 'الإنشاءات الهندسية', 'المساحات والحجوم'],
        tips: 'استخدم الأدوات الهندسية بدقة وارسم الأشكال بوضوح'
    },
    physics: {
        name: 'الفيزياء',
        topics: ['الميكانيكا', 'الكهرباء', 'المغناطيسية', 'الضوء', 'الحرارة', 'الفيزياء الحديثة'],
        tips: 'احفظ القوانين الأساسية وتدرب على حل المسائل بانتظام'
    },
    chemistry: {
        name: 'الكيمياء',
        topics: ['الكيمياء العضوية', 'الكيمياء غير العضوية', 'الكيمياء الفيزيائية', 'التفاعلات الكيميائية', 'الكيمياء التحليلية'],
        tips: 'احفظ الجدول الدوري وتدرب على موازنة المعادلات الكيميائية'
    },
    biology: {
        name: 'الأحياء',
        topics: ['علم الخلية', 'علم الوراثة', 'علم التشريح', 'علم وظائف الأعضاء', 'علم البيئة'],
        tips: 'ركز على فهم العمليات الحيوية وحفظ المصطلحات العلمية'
    },
    arabic: {
        name: 'اللغة العربية',
        topics: ['النحو', 'الصرف', 'البلاغة', 'الأدب', 'الإملاء', 'التعبير'],
        tips: 'اقرأ كثيراً وتدرب على الإعراب والتحليل الأدبي'
    },
    english: {
        name: 'اللغة الإنجليزية',
        topics: ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing', 'Literature'],
        tips: 'Practice reading English texts daily and expand your vocabulary'
    },
    islamic: {
        name: 'التربية الإسلامية',
        topics: ['القرآن الكريم', 'الحديث الشريف', 'الفقه', 'السيرة النبوية', 'العقيدة'],
        tips: 'احفظ الآيات والأحاديث وافهم معانيها جيداً'
    },
    geography: {
        name: 'الجغرافيا',
        topics: ['الجغرافيا الطبيعية', 'الجغرافيا البشرية', 'الخرائط', 'المناخ', 'الموارد الطبيعية'],
        tips: 'استخدم الخرائط والأطالس لفهم المواقع والظواهر الجغرافية'
    },
    history: {
        name: 'التاريخ',
        topics: ['التاريخ القديم', 'التاريخ الإسلامي', 'التاريخ الحديث', 'تاريخ السودان', 'الحضارات'],
        tips: 'رتب الأحداث التاريخية زمنياً واربطها بأسبابها ونتائجها'
    }
};

// Sample Responses Database (Enhanced with new subjects)
const responseDatabase = {
    greetings: [
        'مرحباً! كيف يمكنني مساعدتك اليوم؟',
        'أهلاً بك! أنا هنا لمساعدتك في دراستك',
        'السلام عليكم! ما هو السؤال الذي تريد المساعدة فيه؟'
    ],
    math: {
        algebra: 'في الجبر، نتعامل مع المعادلات والمتغيرات. المعادلة الخطية البسيطة تأخذ الشكل ax + b = c. لحلها، نعزل المتغير x بطرح b من الطرفين ثم القسمة على a.',
        geometry: 'الهندسة التحليلية تربط بين الجبر والهندسة. معادلة الخط المستقيم: y = mx + c حيث m هو الميل و c هو نقطة التقاطع مع محور y.',
        calculus: 'التفاضل والتكامل من أهم فروع الرياضيات. المشتقة تقيس معدل التغير، والتكامل يحسب المساحة تحت المنحنى.',
        general: 'الرياضيات مادة تعتمد على الفهم والممارسة. ما هو الموضوع المحدد الذي تحتاج مساعدة فيه؟'
    },
    engineering: {
        plane: 'الهندسة المستوية تدرس الأشكال ثنائية الأبعاد. مساحة المثلث = ½ × القاعدة × الارتفاع، ومساحة الدائرة = πr²',
        solid: 'الهندسة الفراغية تدرس الأشكال ثلاثية الأبعاد. حجم المكعب = طول الضلع³، وحجم الكرة = (4/3)πr³',
        general: 'الهندسة تتطلب دقة في الرسم والقياس. ما هو الموضوع الذي تحتاج شرحاً له؟'
    },
    physics: {
        mechanics: 'الميكانيكا تدرس الحركة والقوى. قانون نيوتن الثاني: القوة = الكتلة × التسارع (F = ma). هذا القانون أساسي لفهم حركة الأجسام.',
        electricity: 'الكهرباء تدرس التيار والجهد والمقاومة. قانون أوم: الجهد = التيار × المقاومة (V = IR).',
        light: 'الضوء موجة كهرومغناطيسية. قانون الانعكاس: زاوية السقوط = زاوية الانعكاس.',
        general: 'الفيزياء تفسر الظواهر الطبيعية من حولنا. ما هو الموضوع الذي تريد أن تفهمه أكثر؟'
    },
    chemistry: {
        reactions: 'التفاعلات الكيميائية تحدث عندما تتفاعل المواد لتكوين مواد جديدة. يجب أن تكون المعادلة الكيميائية موزونة (عدد الذرات متساوي في الطرفين).',
        periodic: 'الجدول الدوري ينظم العناصر حسب خصائصها. العناصر في نفس المجموعة لها خصائص متشابهة.',
        organic: 'الكيمياء العضوية تدرس مركبات الكربون. الهيدروكربونات هي أبسط المركبات العضوية.',
        general: 'الكيمياء تدرس المادة وتحولاتها. ما هو الموضوع الذي تحتاج شرحاً له؟'
    },
    biology: {
        cell: 'الخلية هي وحدة البناء الأساسية للكائنات الحية. تحتوي على النواة والسيتوبلازم والغشاء الخلوي.',
        genetics: 'علم الوراثة يدرس انتقال الصفات من الآباء للأبناء. الجينات تحمل المعلومات الوراثية في DNA.',
        ecology: 'علم البيئة يدرس العلاقات بين الكائنات الحية وبيئتها. السلسلة الغذائية توضح انتقال الطاقة.',
        general: 'الأحياء تدرس الكائنات الحية وعملياتها. ما هو الموضوع الذي تريد المساعدة فيه؟'
    },
    arabic: {
        grammar: 'النحو يدرس إعراب الكلمات وموقعها في الجملة. الجملة الاسمية تبدأ باسم (المبتدأ والخبر)، والجملة الفعلية تبدأ بفعل.',
        literature: 'الأدب العربي غني بالشعر والنثر. من أهم العصور: الجاهلي، الإسلامي، الأموي، العباسي، والحديث.',
        rhetoric: 'البلاغة تدرس جمال اللغة وتأثيرها. تشمل علم المعاني والبيان والبديع.',
        general: 'اللغة العربية لغة جميلة وغنية. ما هو الموضوع الذي تريد المساعدة فيه؟'
    },
    english: {
        grammar: 'English grammar includes parts of speech: nouns, verbs, adjectives, adverbs, etc. A simple sentence has a subject and a verb (e.g., "She reads books").',
        vocabulary: 'Building vocabulary is essential. Try to learn new words daily and use them in sentences to remember them better.',
        tenses: 'English has 12 main tenses. Present Simple: I study. Past Simple: I studied. Future Simple: I will study.',
        general: 'English is an important language for communication. What specific topic do you need help with?'
    },
    islamic: {
        quran: 'القرآن الكريم هو كلام الله المنزل على النبي محمد ﷺ. يحتوي على 114 سورة.',
        hadith: 'الحديث الشريف هو ما ورد عن النبي ﷺ من قول أو فعل أو تقرير.',
        fiqh: 'الفقه يدرس الأحكام الشرعية العملية. أركان الإسلام خمسة: الشهادتان، الصلاة، الزكاة، الصوم، الحج.',
        general: 'التربية الإسلامية تعلمنا ديننا وأخلاقنا. ما هو الموضوع الذي تحتاج شرحاً له؟'
    },
    geography: {
        physical: 'الجغرافيا الطبيعية تدرس التضاريس والمناخ والموارد الطبيعية.',
        human: 'الجغرافيا البشرية تدرس السكان والمدن والأنشطة الاقتصادية.',
        maps: 'الخرائط تمثل سطح الأرض. المقياس يوضح النسبة بين المسافة على الخريطة والمسافة الحقيقية.',
        general: 'الجغرافيا تساعدنا على فهم العالم من حولنا. ما هو الموضوع الذي تريد المساعدة فيه؟'
    },
    history: {
        ancient: 'التاريخ القديم يشمل الحضارات الأولى مثل الفرعونية والبابلية والإغريقية.',
        islamic: 'التاريخ الإسلامي بدأ بالهجرة النبوية عام 622م. شهد عصور الخلفاء الراشدين والأمويين والعباسيين.',
        modern: 'التاريخ الحديث يشمل الثورات الصناعية والحروب العالمية وحركات الاستقلال.',
        general: 'التاريخ يعلمنا من تجارب الماضي. ما هي الفترة التاريخية التي تريد معرفة المزيد عنها؟'
    },
    study_tips: [
        'نصيحة دراسية: خصص وقتاً محدداً للدراسة كل يوم والتزم به',
        'نصيحة: راجع دروسك بانتظام ولا تؤجل المراجعة للامتحان',
        'نصيحة: اشرح ما تعلمته لشخص آخر - هذه أفضل طريقة للتأكد من فهمك',
        'نصيحة: خذ فترات راحة قصيرة أثناء الدراسة لتحسين التركيز',
        'نصيحة: حل أسئلة الامتحانات السابقة لتتعرف على نمط الأسئلة'
    ],
    exam_strategies: [
        'استراتيجية الامتحان: اقرأ جميع الأسئلة أولاً ثم ابدأ بالأسهل',
        'استراتيجية: خصص وقتاً محدداً لكل سؤال ولا تقضِ وقتاً طويلاً على سؤال واحد',
        'استراتيجية: راجع إجاباتك قبل تسليم ورقة الامتحان',
        'استراتيجية: اقرأ السؤال بعناية وتأكد من فهمك له قبل الإجابة'
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadThemePreference();
    showEmptyState();
    hideIntroAfterDelay();
    // Load PDF data in background
    loadPDFData();
});

function hideIntroAfterDelay() {
    setTimeout(() => {
        const intro = document.getElementById('cinematicIntro');
        if (intro) {
            intro.style.display = 'none';
        }
    }, 7500); // 7.5 seconds for dramatic effect
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('shehabgpt_theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.body.setAttribute('data-theme', currentTheme);
    }
}

function saveThemePreference() {
    localStorage.setItem('shehabgpt_theme', currentTheme);
}

async function loadPDFData() {
    console.log('🔄 بدء تحميل ملفات PDF...');
    console.log('⚠️ ملاحظة: قد تحتاج لتشغيل الموقع على خادم محلي (مثل Live Server) لتجنب مشاكل CORS');
    
    let loadedCount = 0;
    let totalFiles = 0;
    let failedFiles = [];
    
    for (const [subject, files] of Object.entries(pdfFiles)) {
        try {
            const fileList = Array.isArray(files) ? files : [files];
            totalFiles += fileList.length;
            let subjectText = '';
            
            for (const file of fileList) {
                try {
                    console.log(`📄 محاولة تحميل: ${file}`);
                    const text = await extractPDFText(file);
                    
                    if (text && text.length > 50) {
                        subjectText += text + '\n\n';
                        loadedCount++;
                        console.log(`✅ تم تحميل: ${file} (${text.length} حرف)`);
                    } else {
                        console.warn(`⚠️ ${file}: محتوى فارغ أو قصير جداً`);
                        failedFiles.push(file);
                    }
                } catch (error) {
                    console.error(`❌ تعذر تحميل ${file}:`, error.message);
                    failedFiles.push(file);
                }
            }
            
            if (subjectText.trim()) {
                pdfData[subject] = subjectText;
                console.log(`✅ تم تحميل بيانات ${subjectKnowledge[subject]?.name || subject} (${subjectText.length} حرف)`);
            }
        } catch (error) {
            console.error(`❌ خطأ في تحميل ${subject}:`, error);
        }
    }
    
    console.log(`\n📊 ملخص التحميل:`);
    console.log(`   - ملفات محملة: ${loadedCount} من ${totalFiles}`);
    console.log(`   - مواد جاهزة: ${Object.keys(pdfData).length}`);
    
    if (failedFiles.length > 0) {
        console.warn(`\n⚠️ ملفات فشل تحميلها (${failedFiles.length}):`);
        failedFiles.forEach(f => console.warn(`   - ${f}`));
    }
    
    if (loadedCount === 0) {
        console.error('\n❌ لم يتم تحميل أي ملف PDF!');
        console.error('💡 الأسباب المحتملة:');
        console.error('   1. مشكلة CORS - استخدم Live Server أو خادم محلي');
        console.error('   2. ملفات PDF محمية بكلمة مرور');
        console.error('   3. ملفات PDF مصورة (غير قابلة للبحث)');
        console.error('   4. مسار الملفات غير صحيح');
        console.error('\n💡 الموقع سيعمل بالردود الافتراضية فقط');
    } else {
        console.log('\n✅ اكتمل تحميل ملفات PDF المتاحة');
        console.log('💡 الموقع جاهز للإجابة من محتوى PDF!');
        console.log(`💡 معدل النجاح: ${Math.round((loadedCount/totalFiles)*100)}%`);
    }
}

async function extractPDFText(pdfPath) {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        return fullText;
    } catch (error) {
        throw new Error(`فشل استخراج النص من PDF: ${error.message}`);
    }
}

function initializeEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Subject buttons
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSubject = btn.dataset.subject;
            
            if (chatHistory.length === 0) {
                addBotMessage(`تم اختيار ${btn.textContent.trim()}. كيف يمكنني مساعدتك؟`);
            }
        });
    });

    // Send button
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    
    // Enter key to send
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    document.getElementById('userInput').addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', currentTheme);
    saveThemePreference();
}

function showEmptyState() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">💬</div>
            <h3>ابدأ المحادثة</h3>
            <p>اختر مادة من الأعلى واسأل أي سؤال تريد</p>
        </div>
    `;
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Clear empty state if exists
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) {
        document.getElementById('chatWindow').innerHTML = '';
    }
    
    // Add user message
    addUserMessage(message);
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate and show bot response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(message);
        addBotMessage(response);
    }, 1000 + Math.random() * 1000);
}

function addUserMessage(text) {
    const chatWindow = document.getElementById('chatWindow');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-user';
    messageDiv.innerHTML = `
        <div class="message-content">${escapeHtml(text)}</div>
    `;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    chatHistory.push({ role: 'user', content: text });
}

function addBotMessage(text) {
    const chatWindow = document.getElementById('chatWindow');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message message-bot';
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
    `;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    chatHistory.push({ role: 'bot', content: text });
}

function showTypingIndicator() {
    const chatWindow = document.getElementById('chatWindow');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message message-bot';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-content typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatWindow.appendChild(typingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Greetings
    if (msg.match(/^(مرحب|أهلا|السلام|hello|hi|hey)$/i)) {
        return responseDatabase.greetings[Math.floor(Math.random() * responseDatabase.greetings.length)];
    }
    
    // Study tips request
    if (msg.match(/نصيحة|نصائح|tip|advice|ساعدني في الدراسة/)) {
        return responseDatabase.study_tips[Math.floor(Math.random() * responseDatabase.study_tips.length)];
    }
    
    // Exam strategies
    if (msg.match(/امتحان|اختبار|exam|test|استراتيجية|كيف أستعد/)) {
        return responseDatabase.exam_strategies[Math.floor(Math.random() * responseDatabase.exam_strategies.length)];
    }
    
    // استخدام النظام الذكي الجديد!
    if (smartEngine) {
        console.log('🤖 استخدام النظام الذكي للإجابة...');
        const subject = currentSubject !== 'all' ? currentSubject : null;
        const smartAnswer = smartEngine.generateAnswer(userMessage, subject);
        
        if (smartAnswer) {
            return smartAnswer;
        }
    }
    
    // إذا كان المستخدم اختار مادة معينة، ابحث فيها أولاً
    if (currentSubject !== 'all') {
        const response = getSubjectResponse(currentSubject, userMessage);
        if (response) {
            return response;
        }
    }
    
    // محاولة اكتشاف المادة من السؤال
    let detectedSubject = null;
    
    if (msg.match(/رياضيات|جبر|تفاضل|تكامل|معادلة|دالة|math|algebra|calculus|equation/)) {
        detectedSubject = 'math';
    } else if (msg.match(/هندسة|مساحة|حجم|مثلث|دائرة|مستطيل|engineering|geometry|triangle|circle/)) {
        detectedSubject = 'engineering';
    } else if (msg.match(/فيزياء|ميكانيكا|كهرباء|قوة|سرعة|تسارع|physics|mechanics|electricity|force|velocity/)) {
        detectedSubject = 'physics';
    } else if (msg.match(/كيمياء|تفاعل|عنصر|مركب|ذرة|chemistry|reaction|element|compound|atom/)) {
        detectedSubject = 'chemistry';
    } else if (msg.match(/أحياء|خلية|وراثة|جين|كائن|biology|cell|genetics|gene|organism/)) {
        detectedSubject = 'biology';
    } else if (msg.match(/عربي|نحو|أدب|بلاغة|شعر|نثر|إعراب|arabic|grammar|literature/)) {
        detectedSubject = 'arabic';
    } else if (msg.match(/انجليزي|english|grammar|vocabulary|tense/)) {
        detectedSubject = 'english';
    } else if (msg.match(/إسلامية|قرآن|حديث|فقه|سيرة|islamic|quran|hadith/)) {
        detectedSubject = 'islamic';
    } else if (msg.match(/جغرافيا|خريطة|مناخ|قارة|محيط|geography|map|climate|continent/)) {
        detectedSubject = 'geography';
    } else if (msg.match(/تاريخ|حضارة|عصر|حرب|history|civilization|war|era/)) {
        detectedSubject = 'history';
    }
    
    if (detectedSubject) {
        const response = getSubjectResponse(detectedSubject, userMessage);
        if (response) {
            return `<strong>📚 ${subjectKnowledge[detectedSubject].name}:</strong><br><br>${response}`;
        }
    }
    
    // إذا لم نجد إجابة محددة، نعطي رد ذكي
    return generateSmartResponse(userMessage);
}

// دالة جديدة لتوليد رد ذكي
function generateSmartResponse(question) {
    const responses = [
        `سؤال مثير للاهتمام! للإجابة عليه بدقة، يمكنك:<br><br>
        1. اختيار المادة المناسبة من القائمة أعلاه<br>
        2. إعادة صياغة السؤال بشكل أكثر تحديداً<br>
        3. ذكر الموضوع أو الفصل الذي تدرسه<br><br>
        💡 مثال: "ما هو قانون نيوتن الثاني في الفيزياء؟"`,
        
        `أفهم سؤالك، لكن أحتاج المزيد من التفاصيل لأساعدك بشكل أفضل:<br><br>
        • ما هي المادة الدراسية؟<br>
        • ما هو الموضوع المحدد؟<br>
        • هل تريد شرحاً أم حل مسألة؟<br><br>
        🎯 اختر المادة من الأعلى وأعد طرح سؤالك!`,
        
        `شكراً على سؤالك! لأعطيك إجابة دقيقة:<br><br>
        ✓ حدد المادة من شريط المواد أعلاه<br>
        ✓ اكتب سؤالك بوضوح<br>
        ✓ اذكر الكلمات المفتاحية المهمة<br><br>
        📖 أنا هنا لمساعدتك في جميع المواد!`,
        
        `أنا جاهز لمساعدتك! لكن أحتاج أن تكون أكثر تحديداً:<br><br>
        🔍 ما هي المادة؟ (رياضيات، فيزياء، كيمياء...)<br>
        🔍 ما هو الموضوع؟ (مثلاً: المعادلات، الكهرباء، النحو...)<br>
        🔍 ما نوع المساعدة؟ (شرح، حل، مراجعة...)<br><br>
        💪 دعنا نبدأ من جديد بسؤال أوضح!`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function getSubjectResponse(subject, message) {
    const subjectData = responseDatabase[subject];
    const pdfContent = pdfData[subject];
    
    console.log(`\n📖 محاولة الإجابة عن: "${message}"`);
    console.log(`📚 المادة: ${subjectKnowledge[subject]?.name}`);
    
    // إذا كان هناك محتوى PDF، حاول البحث فيه أولاً
    if (pdfContent && pdfContent.length > 100) {
        console.log(`✅ محتوى PDF متوفر (${pdfContent.length} حرف)`);
        const answer = searchInPDF(pdfContent, message, subject);
        if (answer) {
            console.log('✅ تم إيجاد إجابة من PDF');
            return answer;
        } else {
            console.log('⚠️ لم يتم إيجاد إجابة مطابقة في PDF');
        }
    } else {
        console.log('⚠️ محتوى PDF غير متوفر أو فارغ');
    }
    
    // إذا لم نجد في PDF، استخدم قاعدة البيانات الافتراضية
    if (!subjectData) {
        return `أنا متخصص في مساعدتك في ${subjectKnowledge[subject]?.name || 'هذه المادة'}. ما هو سؤالك المحدد؟`;
    }
    
    // البحث عن موضوع محدد
    for (const [key, value] of Object.entries(subjectData)) {
        if (key !== 'general' && (message.includes(key) || message.match(new RegExp(key, 'i')))) {
            console.log(`✅ تم إيجاد إجابة افتراضية للموضوع: ${key}`);
            return value;
        }
    }
    
    // رد عام مع معلومات المادة
    if (subjectData.general) {
        const info = subjectKnowledge[subject];
        console.log('✅ استخدام الرد العام للمادة');
        return `${subjectData.general}<br><br><strong>المواضيع الرئيسية:</strong><br>${info.topics.join('، ')}<br><br><strong>نصيحة:</strong> ${info.tips}`;
    }
    
    return `أنا هنا لمساعدتك في ${subjectKnowledge[subject]?.name}. يمكنك سؤالي عن أي موضوع في هذه المادة.`;
}

// دالة محسّنة للبحث في محتوى PDF
function searchInPDF(pdfContent, question, subject) {
    try {
        console.log(`🔍 البحث في محتوى ${subjectKnowledge[subject]?.name}...`);
        
        // استخراج الكلمات المفتاحية من السؤال
        const keywords = extractKeywords(question);
        
        console.log(`🔑 الكلمات المفتاحية: ${keywords.join(', ')}`);
        
        if (keywords.length === 0) {
            console.log('⚠️ لم يتم العثور على كلمات مفتاحية');
            return null;
        }
        
        // تقسيم المحتوى إلى جمل وفقرات
        const sentences = pdfContent.split(/[.؟!?\n]+/).filter(s => s.trim().length > 20);
        const relevantSentences = [];
        
        console.log(`📄 عدد الجمل في المحتوى: ${sentences.length}`);
        
        for (const sentence of sentences) {
            let score = 0;
            const lowerSentence = sentence.toLowerCase();
            let matchedKeywords = [];
            
            // حساب درجة التطابق مع تحسينات
            for (const keyword of keywords) {
                const lowerKeyword = keyword.toLowerCase();
                
                // تطابق كامل
                if (lowerSentence.includes(lowerKeyword)) {
                    score += keyword.length * 2;
                    matchedKeywords.push(keyword);
                }
                
                // تطابق جزئي (للكلمات الطويلة)
                if (keyword.length > 4) {
                    const partial = keyword.substring(0, Math.floor(keyword.length * 0.7));
                    if (lowerSentence.includes(partial)) {
                        score += keyword.length * 0.5;
                    }
                }
            }
            
            if (score > 0) {
                relevantSentences.push({
                    text: sentence.trim(),
                    score: score,
                    matchedKeywords: matchedKeywords
                });
            }
        }
        
        console.log(`✅ عدد الجمل المطابقة: ${relevantSentences.length}`);
        
        // ترتيب حسب الدرجة
        relevantSentences.sort((a, b) => b.score - a.score);
        
        if (relevantSentences.length > 0) {
            // أخذ أفضل 3-5 جمل
            const topSentences = relevantSentences.slice(0, 5);
            let answer = `<strong>📚 من محتوى ${subjectKnowledge[subject]?.name}:</strong><br><br>`;
            
            topSentences.forEach((s) => {
                let cleanText = s.text.trim();
                
                // تنظيف النص
                cleanText = cleanText.replace(/\s+/g, ' ');
                
                // تقصير إذا كان طويلاً جداً
                if (cleanText.length > 400) {
                    cleanText = cleanText.substring(0, 400) + '...';
                }
                
                answer += `• ${cleanText}<br><br>`;
            });
            
            answer += `<div style="margin-top: 10px; padding: 10px; background: rgba(220, 38, 38, 0.1); border-radius: 8px;">`;
            answer += `<strong>💡 نصيحة:</strong> هذه المعلومات مستخرجة من المنهج. `;
            answer += `إذا كنت تريد المزيد من التفاصيل، اسأل سؤالاً أكثر تحديداً!`;
            answer += `</div>`;
            
            console.log('✅ تم إنشاء إجابة من محتوى PDF');
            return answer;
        }
        
        console.log('⚠️ لم يتم العثور على محتوى مطابق');
        return null;
    } catch (error) {
        console.error('❌ خطأ في البحث في PDF:', error);
        return null;
    }
}

// دالة محسّنة لاستخراج الكلمات المفتاحية من السؤال
function extractKeywords(question) {
    // إزالة الكلمات الشائعة (Stop words) - موسعة
    const stopWords = [
        // عربي
        'ما', 'هو', 'هي', 'في', 'من', 'إلى', 'على', 'عن', 'مع', 'أن', 'إن', 'لا', 'نعم',
        'الذي', 'التي', 'هذا', 'هذه', 'ذلك', 'تلك', 'كيف', 'لماذا', 'متى', 'أين', 'أي',
        'هل', 'ماذا', 'كم', 'أي', 'كل', 'بعض', 'جميع', 'و', 'أو', 'لكن', 'ثم', 'لأن',
        'عند', 'بعد', 'قبل', 'فوق', 'تحت', 'بين', 'خلال', 'حول', 'ضد', 'نحو', 'لدى',
        'يكون', 'كان', 'يعني', 'معنى', 'شرح', 'اشرح', 'وضح', 'عرف', 'اذكر', 'بين',
        'اريد', 'عايز', 'ممكن', 'لو', 'سمحت', 'رجاء', 'من فضلك',
        // English
        'the', 'is', 'are', 'was', 'were', 'what', 'how', 'why', 'when', 'where',
        'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
        'can', 'could', 'would', 'should', 'will', 'do', 'does', 'did', 'have', 'has',
        'please', 'tell', 'me', 'you', 'explain', 'define', 'describe'
    ];
    
    // تنظيف السؤال
    let cleanQuestion = question.toLowerCase()
        .replace(/[؟?!.،,;:""''()[\]{}]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    // تقسيم إلى كلمات
    const words = cleanQuestion.split(/\s+/)
        .filter(word => word.length > 2)
        .filter(word => !stopWords.includes(word))
        .filter(word => !/^\d+$/.test(word)); // إزالة الأرقام البحتة
    
    // إزالة التكرار وترتيب حسب الطول (الكلمات الأطول أكثر أهمية)
    const uniqueWords = [...new Set(words)];
    uniqueWords.sort((a, b) => b.length - a.length);
    
    // أخذ أهم 5-7 كلمات
    return uniqueWords.slice(0, 7);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
