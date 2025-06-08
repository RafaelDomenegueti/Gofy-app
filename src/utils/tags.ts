import i18n from '../i18n';

export interface Tag {
  id: string;
  translationKey: string;
}

export const tags: Tag[] = [
  {
    id: '2c69a89a-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.fantasy',
  },
  {
    id: '2c69aa5c-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.scienceFiction',
  },
  {
    id: '2c69ab56-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.dystopian',
  },
  {
    id: '2c69ac46-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.actionAdventure',
  },
  {
    id: '2c69af52-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.mystery',
  },
  {
    id: '2c69b038-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.horror',
  },
  {
    id: '2c69b11e-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.thrillerSuspense',
  },
  {
    id: '2c69b1f0-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.historicalFiction',
  },
  {
    id: '2c69b2ea-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.romance',
  },
  {
    id: '2c69b3d0-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.trueCrime',
  },
  {
    id: '2c69b4a2-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.history',
  },
  {
    id: '2c69b588-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.humor',
  },
  {
    id: '2c69b862-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.religionSpirituality',
  },
  {
    id: '2c69b93e-3df5-11ed-b878-0242ac120002',
    translationKey: 'tags.scienceTechnology',
  },
];

export const getTagName = (tag: Tag): string => {
  return i18n.t(tag.translationKey);
};
