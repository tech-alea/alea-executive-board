// src/app/api/sendEmail.ts
import type { PayloadRequest } from 'payload'
// NON importare 'Response' e 'NextFunction' da Express

interface EmailRequestBody {
  to: string;
  subject: string;
  message: string;
}

// Cambia la firma: rimuovi res e next.
export const sendEmailHandler = async (req: PayloadRequest): Promise<Response> => {

  // 2. Prendi i dati dal corpo della richiesta
  // Nota: req.json() è il modo moderno per leggere il body in questo contesto
  let body: EmailRequestBody;
  try {
    body = await (req as any).json();
  } catch (parseError) {
    return Response.json({ error: 'Body JSON malformato.' }, { status: 400 });
  }

  const { to, subject, message } = body;

  if (!to || !subject || !message) {
    // Restituisci una Response
    return Response.json({ error: 'Campi "to", "subject", e "message" sono richiesti.' }, { status: 400 });
  }

  // 3. Usa l'API di Payload per inviare l'email
  try {
    await req.payload.sendEmail({
      to: to,
      subject: subject,
      html: `<p>${message}</p>`,
    });

    // 4. Invia una risposta di successo
    return Response.json({ success: true, message: 'Email inviata con successo!' }, { status: 200 });

  } catch (error) {
    // 5. Gestisci eventuali errori
    console.error("Errore durante l'invio dell'email:", error);

    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    return Response.json({ error: "Impossibile inviare l'email.", details: errorMessage }, { status: 500 });
    }
  };
