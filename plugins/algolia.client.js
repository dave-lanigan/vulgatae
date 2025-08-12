export default defineNuxtPlugin(async () => {
  const {
    public: {
      algoliaApplicationId = '',
      algoliaSearchApiKey = '',
      algoliaIndexName = 'verses'
    }
  } = useRuntimeConfig()

  if (!algoliaApplicationId || !algoliaSearchApiKey) {
    return {
      provide: {
        algolia: null,
        searchIndex: {
          async search() {
            return { hits: [], nbHits: 0 }
          }
        }
      }
    }
  }

  try {
    const { algoliasearch } = await import('algoliasearch')
    const client = algoliasearch(algoliaApplicationId, algoliaSearchApiKey)
    
    // Create a wrapper that uses the v5 API
    const searchIndex = {
      async search(query, options = {}) {
        const response = await client.search({
          requests: [{
            indexName: algoliaIndexName,
            query,
            hitsPerPage: options.hitsPerPage || 20,
            attributesToRetrieve: options.attributesToRetrieve,
            attributesToHighlight: options.attributesToHighlight,
            highlightPreTag: options.highlightPreTag,
            highlightPostTag: options.highlightPostTag
          }]
        })
        return response.results[0]
      }
    }

    return { provide: { algolia: client, searchIndex } }
  } catch (error) {
    console.error('Failed to initialize Algolia:', error)
    return {
      provide: {
        algolia: null,
        searchIndex: {
          async search() {
            return { hits: [], nbHits: 0 }
          }
        }
      }
    }
  }
})
