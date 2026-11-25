import { Mail, MessageCircle, Phone } from "lucide-react";

import { formatPhone, type Promoter } from "@/lib/site";
import { initials } from "@/lib/utils";

export function PromoterCard({ promoter }: { promoter: Promoter }) {
  return (
    <article className="promoter">
      <span className="avatar" aria-hidden="true">
        {initials(promoter.name)}
      </span>
      <div>
        <h3>{promoter.name}</h3>
        <p className="role">{promoter.role}</p>
        <div className="contact-links">
          {promoter.phones.map((phone) => (
            <a href={`tel:+229${phone}`} key={phone}>
              <Phone size={14} aria-hidden="true" />
              {formatPhone(phone)}
            </a>
          ))}
          <a href={`mailto:${promoter.email}`}>
            <Mail size={14} aria-hidden="true" />
            {promoter.email}
          </a>
          <a
            href={`https://wa.me/${promoter.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={14} aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
