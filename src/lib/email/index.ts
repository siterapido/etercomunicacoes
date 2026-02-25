import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "eter@eter.com.br";
const APP_NAME = "Eter Comunicações";

interface ApprovalEmailParams {
  to: string;
  clientName: string;
  taskTitle: string;
  projectName: string;
  approvalUrl: string;
  requesterName: string;
  notes?: string;
}

export async function sendApprovalEmail(params: ApprovalEmailParams) {
  if (!resend) {
    console.log("[Email] Resend não configurado. Email seria enviado para:", params.to);
    return;
  }

  const { to, clientName, taskTitle, projectName, approvalUrl, requesterName, notes } = params;

  await resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `Aprovação necessária: ${taskTitle} — ${projectName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 40px 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #0A0A0A; padding: 32px 40px; text-align: center; }
    .logo { color: #D4A843; font-size: 22px; font-weight: 700; letter-spacing: 0.3em; }
    .logo span { color: #D4A843; }
    .body { padding: 40px; }
    .greeting { font-size: 22px; font-weight: 600; color: #0A0A0A; margin-bottom: 12px; }
    .text { color: #555; line-height: 1.6; margin-bottom: 16px; font-size: 15px; }
    .task-card { background: #f8f8f8; border-left: 4px solid #D4A843; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .task-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #D4A843; margin-bottom: 8px; }
    .task-title { font-size: 17px; font-weight: 600; color: #0A0A0A; }
    .task-project { font-size: 13px; color: #888; margin-top: 4px; }
    .notes { background: #fffbf0; border: 1px solid #f0e0a0; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px; color: #555; }
    .btn { display: block; width: fit-content; margin: 32px auto; background: #D4A843; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 15px; text-align: center; }
    .footer { background: #f8f8f8; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">E T E R<span>.</span></div>
    </div>
    <div class="body">
      <div class="greeting">Olá, ${clientName}!</div>
      <p class="text">
        <strong>${requesterName}</strong> está aguardando sua aprovação para o seguinte material:
      </p>
      <div class="task-card">
        <div class="task-label">Material para aprovação</div>
        <div class="task-title">${taskTitle}</div>
        <div class="task-project">Projeto: ${projectName}</div>
      </div>
      ${notes ? `<div class="notes"><strong>Observações:</strong><br>${notes}</div>` : ""}
      <p class="text">Clique no botão abaixo para revisar e responder:</p>
      <a href="${approvalUrl}" class="btn">Revisar e Aprovar</a>
      <p class="text" style="font-size:13px; color:#999; text-align:center;">
        Este link é válido por 7 dias.
      </p>
    </div>
    <div class="footer">
      <p>${APP_NAME} — Plataforma de Gestão de Comunicação</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  });
}

interface ApprovalResultEmailParams {
  to: string;
  requesterName: string;
  taskTitle: string;
  projectName: string;
  status: string;
  clientFeedback?: string;
  clientName: string;
}

export async function sendApprovalResultEmail(params: ApprovalResultEmailParams) {
  if (!resend) {
    console.log("[Email] Resend não configurado. Email seria enviado para:", params.to);
    return;
  }

  const { to, requesterName, taskTitle, projectName, status, clientFeedback, clientName } = params;

  const statusMap: Record<string, { label: string; color: string; emoji: string }> = {
    approved: { label: "Aprovado ✓", color: "#16a34a", emoji: "✅" },
    changes_requested: { label: "Alterações Solicitadas", color: "#ca8a04", emoji: "📝" },
    rejected: { label: "Reprovado", color: "#dc2626", emoji: "❌" },
  };

  const statusInfo = statusMap[status] ?? statusMap.changes_requested;

  await resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to,
    subject: `${statusInfo.emoji} ${clientName} respondeu: ${taskTitle}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 40px 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #0A0A0A; padding: 32px 40px; text-align: center; }
    .logo { color: #D4A843; font-size: 22px; font-weight: 700; letter-spacing: 0.3em; }
    .body { padding: 40px; }
    .greeting { font-size: 22px; font-weight: 600; color: #0A0A0A; margin-bottom: 12px; }
    .text { color: #555; line-height: 1.6; margin-bottom: 16px; font-size: 15px; }
    .status-badge { display: inline-block; background: ${statusInfo.color}20; color: ${statusInfo.color}; border: 1px solid ${statusInfo.color}40; padding: 8px 20px; border-radius: 999px; font-weight: 600; font-size: 14px; margin: 16px 0; }
    .feedback { background: #f8f8f8; border-radius: 8px; padding: 20px; margin: 16px 0; font-size: 14px; color: #555; line-height: 1.6; }
    .footer { background: #f8f8f8; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">E T E R<span style="color:#D4A843">.</span></div>
    </div>
    <div class="body">
      <div class="greeting">Olá, ${requesterName}!</div>
      <p class="text">
        <strong>${clientName}</strong> respondeu à solicitação de aprovação de <strong>${taskTitle}</strong> (${projectName}):
      </p>
      <div class="status-badge">${statusInfo.label}</div>
      ${clientFeedback ? `
      <div class="feedback">
        <strong>Feedback do cliente:</strong><br>
        ${clientFeedback}
      </div>
      ` : ""}
      <p class="text">Acesse a plataforma para ver os detalhes e tomar as próximas ações.</p>
    </div>
    <div class="footer">
      <p>${APP_NAME} — Plataforma de Gestão de Comunicação</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  });
}
