export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  fromName?: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  date?: string;
  subject?: string;
  to?: string;
}

// Convert RFC 2822 email format to URL-safe Base64
function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function fetchGmailProfile(accessToken: string): Promise<GmailProfile> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Gmail profile: ${errorText}`);
  }

  return response.json();
}

export async function sendGmailEmail(
  accessToken: string,
  payload: SendEmailPayload
): Promise<{ id: string; threadId: string }> {
  const senderHeader = payload.fromName ? `From: "${payload.fromName}"\r\n` : '';
  const textContent = payload.bodyText || payload.bodyHtml.replace(/<[^>]*>/g, '');

  const rawRfc2822 =
    `To: ${payload.to}\r\n` +
    senderHeader +
    `Subject: ${payload.subject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/html; charset=utf-8\r\n\r\n` +
    `${payload.bodyHtml}`;

  const base64Raw = base64UrlEncode(rawRfc2822);

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: base64Raw }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email via Gmail: ${errorText}`);
  }

  return response.json();
}

export async function createGmailDraft(
  accessToken: string,
  payload: SendEmailPayload
): Promise<{ id: string; message: { id: string } }> {
  const senderHeader = payload.fromName ? `From: "${payload.fromName}"\r\n` : '';

  const rawRfc2822 =
    `To: ${payload.to}\r\n` +
    senderHeader +
    `Subject: ${payload.subject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/html; charset=utf-8\r\n\r\n` +
    `${payload.bodyHtml}`;

  const base64Raw = base64UrlEncode(rawRfc2822);

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/drafts',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: { raw: base64Raw },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Gmail draft: ${errorText}`);
  }

  return response.json();
}

export async function listRecentSentMessages(
  accessToken: string,
  maxResults: number = 5
): Promise<GmailMessageSummary[]> {
  const queryUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=in:sent`;
  const response = await fetch(queryUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return [];
  }

  const listData = await response.json();
  if (!listData.messages || !Array.isArray(listData.messages)) {
    return [];
  }

  const messageSummaries: GmailMessageSummary[] = [];

  for (const msgItem of listData.messages.slice(0, 5)) {
    try {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgItem.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=To&metadataHeaders=Date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (msgRes.ok) {
        const fullMsg = await msgRes.json();
        const headers = fullMsg.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const to = headers.find((h: any) => h.name.toLowerCase() === 'to')?.value || '';
        const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

        messageSummaries.push({
          id: fullMsg.id,
          threadId: fullMsg.threadId,
          snippet: fullMsg.snippet,
          subject,
          to,
          date,
        });
      }
    } catch (e) {
      // ignore individual message failures
    }
  }

  return messageSummaries;
}
