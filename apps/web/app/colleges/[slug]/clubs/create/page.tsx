console.log('Creating club:', { ...formData, collegeSlug: slug });

// Simulate API call
await new Promise(resolve => setTimeout(resolve, 1000));

router.push(`/colleges/${slug}/clubs`);
        } catch (error) {
    console.error('Failed to create club:', error);
    alert('Failed to create club. Please try again.');
} finally {
    setLoading(false);
}
    };

return (
    <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto">
            <NewspaperCard className="p-8 relative bg-white">
                <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />

                <div className="text-center mb-8">
                    <Badge className="mb-2 bg-accent-purple text-white border-black">NEW CLUB</Badge>
                    <h1 className="font-display text-4xl font-black">START A REVOLUTION</h1>
                    <p className="font-serif text-gray-600 mt-2">
                        Or just a chess club. That's cool too.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-bold text-sm mb-2">CLUB NAME</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 border-2 border-black rounded-lg font-serif focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            placeholder="e.g. The Dead Poets Society"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-sm mb-2">CATEGORY</label>
                        <select
                            className="w-full p-3 border-2 border-black rounded-lg font-serif focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="GENERAL">General Interest</option>
                            <option value="TECH">Technology & Coding</option>
                            <option value="ARTS">Arts & Culture</option>
                            <option value="SPORTS">Sports & Fitness</option>
                            <option value="SOCIAL">Social Service</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-bold text-sm mb-2">DESCRIPTION</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full p-3 border-2 border-black rounded-lg font-serif focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            placeholder="What's your mission? World domination?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <RetroButton
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.back()}
                        >
                            CANCEL
                        </RetroButton>
                        <RetroButton
                            type="submit"
                            className="flex-1 bg-black text-white hover:bg-accent-purple hover:text-black"
                            disabled={loading}
                        >
                            {loading ? 'STARTING...' : 'LAUNCH CLUB'}
                        </RetroButton>
                    </div>
                </form>
            </NewspaperCard>
        </div>

        <Doodle src="/doodles/idea.svg" className="fixed bottom-10 left-10 w-32 h-32 opacity-20 rotate-12 pointer-events-none" />
    </div>
);
}
