<template>
    <div class="w-full">
        <div class="m-4">
            <h2 class="text-2xl font-bold font-serif text-blue-950">Daily Mass Readings</h2>
        </div>

        <div class="m-6 flex justify-center">
            <div class="card w-full h-full bg-base-100 shadow-md border border-gray-200 hover:border-blue-950 transition-colors">
                <div class="card-body p-4">
                    <h2 class="card-title text-lg font-serif text-blue-950 mb-2">{{ card.title }}</h2>
                    <p class="text-sm font-bold text-gray-600 mb-4">{{ card.summary }}</p>

                    <div class="mb-4">
                        <p class="text-lg text-gray-700 italic">"{{ card.introitText }}"</p>
                    </div>
                    
                    <!-- Readings -->
                    <div class="space-y-2 mb-4 text-sm text-gray-700">
                        <p><span class="font-semibold">Introit:</span> {{ card.introit }}</p>
                        <p><span class="font-semibold">Gospel:</span> {{ card.gospel }}</p>
                        <p><span class="font-semibold">Epistle:</span> {{ card.epistle }}</p>
                        <p><span class="font-semibold">Gradual:</span> {{ card.gradual }}</p>
                    </div>
                    
                    <!-- Action -->
                    <div class="card-actions justify-end">
                        <button class="btn btn-ghost text-blue-950">Read Today's Readings ></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const liturgicalSeason = ref('Tempus per Annum')
const liturgicalInfo = ref('Feria Secunda, Hebdomada XXIII per Annum')

const card = {
    title: 'Sunday Aug 10th',
    summary: "Ninth Sunday after Pentecost",
    icon: 'mdi:lightbulb-on-outline',
    introit: 'Psalm 66:1-2',
    introitText: 'O God, be gracious and bless us, and let your face shed its light upon us.',
    gospel: 'Matthew 5:14-16',
    epistle: 'Romans 12:2',
    gradual: 'Psalm 1:1-3'
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Crimson+Text:wght@400;600&display=swap');

.font-serif {
  font-family: 'EB Garamond', serif;
}
</style>