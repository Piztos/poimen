import nodemailer from 'nodemailer';

// Configuração do transporter (use variáveis de ambiente em produção)
const createTransporter = () => {
  // Se tiver credenciais de SMTP configuradas, use-as
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Para desenvolvimento/teste, use Ethereal (email fake)
  // Em produção, você DEVE configurar SMTP real
  return null;
};

export const sendWelcomeEmail = async (email, temporaryPassword) => {
  const transporter = createTransporter();

  // Se não tiver transporter configurado, apenas loga (para desenvolvimento)
  if (!transporter) {
    console.log('='.repeat(60));
    console.log('📧 EMAIL DE CADASTRO (Modo Desenvolvimento)');
    console.log('='.repeat(60));
    console.log(`Para: ${email}`);
    console.log(`Senha temporária: ${temporaryPassword}`);
    console.log('='.repeat(60));
    console.log('⚠️  Configure SMTP_HOST, SMTP_USER, SMTP_PASS em produção');
    console.log('='.repeat(60));
    return { success: true, devMode: true };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Poimen" <noreply@poimen.com.br>',
    to: email,
    subject: 'Bem-vindo ao Poimen - Sua senha de acesso',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">🙏 Bem-vindo ao Poimen!</h2>
        
        <p>Sua conta foi criada com sucesso.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 10px 0 0 0;"><strong>Senha temporária:</strong> 
            <span style="font-size: 18px; color: #6366f1; font-weight: bold;">${temporaryPassword}</span>
          </p>
        </div>

        <p><strong>Próximos passos:</strong></p>
        <ol>
          <li>Faça login com essa senha</li>
          <li>Configure suas chaves de API (Groq e/ou Gemini)</li>
          <li>Comece a usar o sistema de análise bíblica!</li>
        </ol>

        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Este é um email automático. Se você não se cadastrou no Poimen, ignore esta mensagem.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email');
  }
};

export const generateTemporaryPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sem caracteres ambíguos
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
