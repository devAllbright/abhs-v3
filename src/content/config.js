import { defineCollection, z } from 'astro:content';

const citiesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    city: z.string(),
    region: z.string(),
    neighborhoods: z.array(z.string()),
    localDispatchManager: z.string(),
    localPricingBaseline: z.object({
      startingRate: z.number(),
      currency: z.string(),
      discountCode: z.string().optional(),
    }),
    lat: z.number(),
    lng: z.number(),
    zipCodes: z.array(z.string()),
  }),
});

const servicesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    summary: z.string(),
    description: z.string(),
    basePrice: z.number(),
    parentHubPath: z.string(),
    descriptionData: z.object({
      title: z.string(),
      imageUrl: z.string(),
      videoUrl: z.string().optional(),
      paragraphs: z.array(
        z.object({
          subtitle: z.string(),
          brief: z.string(),
        })
      ),
    }),
    reasonsData: z.array(
      z.object({
        icon: z.string(),
        reasonsTitle: z.string(),
        description: z.string(),
      })
    ),
    finalCTAData: z.object({
      imgSrc: z.string(),
      imgAlt: z.string(),
      title: z.string(),
      brief: z.string(),
      callToActionText: z.string(),
      contactText: z.string(),
    }),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
  }),
});

export const collections = {
  cities: citiesCollection,
  services: servicesCollection,
};
