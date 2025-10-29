import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is this platform suitable for small businesses?',
    answer: 'Absolutely! Our platform is designed to scale. The "Starter" tier is perfect for small businesses and startups looking to get organized and grow.',
  },
  {
    question: 'Can I integrate my own tools?',
    answer: 'Yes. Our platform provides a robust API and webhook support, allowing you to connect to a wide range of third-party services and build custom integrations.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Security is our top priority. Your data is isolated in its own tenant and all connections are encrypted. We use Clerk for authentication, which provides industry-standard security features.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We offer email support for all plans. Customers on our "Professional" and "Enterprise" tiers receive priority support and dedicated account management.',
  },
];

export function FAQ() {
  return (
    <section className="container max-w-4xl py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Get answers to the most common questions about our platform.
        </p>
      </div>
      <Accordion type="single" collapsible className="mt-12 w-full">
        {faqs.map((faq, i) => (
          <AccordionItem value={`item-${i}`} key={i}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}