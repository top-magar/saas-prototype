# Vercel Multi-tenant Setup

## 1. Domain Configuration

### Custom Domain Setup:
1. Add your domain in Vercel dashboard: `yourdomain.com`
2. Configure DNS A record: `@ -> 76.76.19.19`
3. Configure DNS CNAME record: `* -> cname.vercel-dns.com`

### Environment Variables:
```bash
NEXT_PUBLIC_DOMAIN=yourdomain.com
```

## 2. Subdomain Testing

### Development:
- `tenant1.localhost:3000`
- `tenant2.localhost:3000`

### Production:
- `tenant1.yourdomain.com`
- `tenant2.yourdomain.com`

## 3. Deployment Commands

```bash
# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_DOMAIN production
vercel env add DATABASE_URL production
```

## 4. DNS Requirements

Your DNS provider must support:
- Wildcard CNAME records (`*.yourdomain.com`)
- Vercel's DNS servers for automatic subdomain routing