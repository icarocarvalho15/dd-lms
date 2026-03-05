<html>
<head>
    <style>
        body { font-family: 'Helvetica', sans-serif; text-align: center; padding: 50px; border: 20px solid #2563eb; }
        .logo { font-size: 40px; font-weight: bold; color: #2563eb; margin-bottom: 30px; }
        h1 { font-size: 50px; margin-bottom: 10px; }
        p { font-size: 20px; color: #666; }
        .name { font-size: 35px; font-weight: bold; color: #000; margin: 20px 0; }
        .footer { margin-top: 50px; font-size: 12px; color: #aaa; }
    </style>
</head>
<body>
    <div class="logo">DRAVDEV ACADEMY</div>
    <p>Certificamos que</p>
    <div class="name">{{ $student_name }}</div>
    <p>concluiu com êxito o treinamento de</p>
    <h2>{{ $course_title }}</h2>
    <p>em {{ $date }}</p>
    <div class="footer">Autenticidade: {{ $certificate_id }}</div>
</body>
</html>