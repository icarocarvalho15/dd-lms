<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        @page { margin: 0; }
        html, body { margin: 0; padding: 0; width: 297mm; height: 210mm; overflow: hidden; background-color: #fff; font-family: 'Helvetica', sans-serif; }
        .border-frame { position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; border: 15px solid #2563eb; box-sizing: border-box; z-index: 10; }
        .wrapper { width: 100%; height: 100%; display: table; text-align: center; }
        .content { display: table-cell; vertical-align: middle; padding: 60px; }
        .logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 40px; }
        .title { font-size: 75px; font-weight: 900; color: #111; margin: 0; text-transform: uppercase; }
        .line { width: 400px; height: 2px; background: #eee; margin: 30px auto; }
        .subtitle { font-size: 22px; color: #666; margin: 10px 0; }
        .name { font-size: 55px; font-weight: bold; color: #2563eb; margin: 20px 0; }
        .course { font-size: 35px; font-weight: 800; color: #111; font-style: italic; }
        .footer { position: absolute; bottom: 50px; left: 0; width: 100%; text-align: center; z-index: 20; }
        .footer-text { font-size: 11px; color: #999; line-height: 1.4; display: block; margin: 0 auto; width: 100%; }
    </style>
</head>
<body>
    <div class="border-frame"></div>
    <div class="wrapper">
        <div class="content">
            <div class="logo">DRAVDEV ACADEMY</div>
            <h1 class="title">CERTIFICADO</h1>
            <div class="line"></div>
            <p class="subtitle">Certificamos para os devidos fins que</p>
            <div class="name">{{ $user_name }}<span style="color: #999;">,</span></div>
            <p class="subtitle">concluiu com êxito o treinamento de nível profissional</p>
            <div class="course">{{ $course_name }}</div>
            <p class="subtitle">com carga horária total de <strong>{{ $duration }} minutos</strong>.</p>
            <p class="subtitle" style="margin-top: 30px">Concluído em {{ $date }}.</p>
            <div class="footer">
                <span class="footer-text">
                    Código de Verificação: <strong>{{ $certificate_code }}</strong><br>
                    Valide a autenticidade deste documento em <strong>dravdev.com/verificar</strong>
                </span>
            </div>
        </div>
    </div>
</body>
</html>