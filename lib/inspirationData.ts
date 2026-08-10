export interface InspirationPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  status: 'published';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

const staticInspirationPosts: InspirationPost[] = [
  {
    _id: 'static-how-to-choose-wall-art',
    title: 'How to Choose Wall Art That Makes a Room Feel Finished',
    slug: 'how-to-choose-wall-art',
    excerpt: 'A practical guide to choosing wall art that feels intentional, balanced and beautifully suited to your home.',
    content: `
<p>A blank wall can make even a beautifully furnished room feel unfinished. The right artwork changes that instantly: it gives the eye somewhere to land, brings separate pieces together and makes a space feel like it belongs to you. Learning how to choose wall art is less about following rigid design rules and more about noticing what your room is already asking for.</p>
<p>Start with the feeling you want to create. A large abstract canvas can make a living room feel confident and composed; a soft landscape can bring calm to a bedroom; graphic posters can add energy to an office or hallway. Once you see wall art as part of the room rather than an afterthought, choosing it becomes much easier.</p>
<img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80" alt="Warm, curated living room with statement wall art" class="w-full my-8 rounded-2xl shadow-sm" />
<h2>How to choose wall art by starting with the room</h2>
<p>Before falling for a particular print, look at the room as a whole. Consider its purpose, the natural light, the furniture and the mood you want to spend time in. Art does not need to match every cushion or accessory, but it should feel connected to the space.</p>
<p>A relaxed bedroom often suits artwork with gentle movement, muted tones or an understated palette. In a living room, you may want something with more presence - a bold canvas print, expressive abstract artwork or a striking photographic piece above the sofa. Entryways work beautifully with art that creates an immediate point of view, especially if the space is small and otherwise simple.</p>
<p>Think about the atmosphere, not just the colour scheme. Black-and-white art can look crisp and architectural in a modern interior, while warm ochres, rusts and earthy neutrals can soften a room with timber, cream upholstery or natural textures. If your furniture is pared back, art is often the best place to introduce personality. If the room already has patterned rugs, colourful textiles or statement lighting, a quieter piece may give it room to breathe.</p>
<h2>Get the scale right before choosing the style</h2>
<p>Scale is the detail that separates a wall that feels intentionally styled from one that feels slightly accidental. A small print on a large wall can look lost, however beautiful the image may be. Equally, an oversized piece in a narrow gap can make the room feel crowded.</p>
<p>Above a sofa, bed or console, aim for artwork that is roughly two-thirds to three-quarters of the furniture width. It does not have to be exact, but this proportion gives the arrangement visual balance. A single large canvas is often the simplest answer above a wide sofa, particularly in an open-plan room where the art needs to hold its own from a distance.</p>
<p>For a smaller wall, one carefully chosen medium-sized piece can be more effective than trying to fill every inch. Leave some clear wall around it. That negative space helps the artwork feel considered and gives the room a calmer, more elevated finish.</p>
<p>Height matters just as much. As a useful starting point, hang the centre of a piece at around eye level. When art sits above furniture, leave a visible but connected gap rather than placing it too high. Artwork floating far above a sofa or headboard can make the whole arrangement feel disconnected.</p>
<h2>Choose a colour story, not a perfect match</h2>
<p>The easiest way to make modern wall art look at home is to repeat a colour already present in the room. This might be the green in a plant, the charcoal in a rug, the warm brown of a wooden table or a small accent colour from a cushion. The artwork does not need to replicate that shade exactly. A related tone is often more interesting than a perfect match.</p>
<p>A useful approach is to let your art perform one of three roles. It can blend in by echoing the room's existing palette. It can bridge the space by bringing together colours that already appear separately, such as blue seating and terracotta accessories. Or it can contrast, introducing a deliberate pop of colour into an otherwise neutral setting.</p>
<p>Contrast is especially effective in rooms that feel a little too safe. A vivid red detail within an abstract print can wake up a beige living room without requiring a new sofa. Deep blue artwork can add depth to pale walls. The key is repetition: pick up that new colour once or twice elsewhere, perhaps in a vase, book cover or throw, so it feels purposeful rather than random.</p>
<img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80" alt="Soft bedroom interior with calm artwork above the bed" class="w-full my-8 rounded-2xl shadow-sm" />
<h2>Decide between one statement piece and a gallery wall</h2>
<p>There is no universal winner here. A single statement piece feels clean, contemporary and confident. It is ideal for large blank walls, above key furniture or in rooms where you want the artwork to become the main visual focus. Large-scale canvas prints are particularly effective when you want impact without making a space feel busy.</p>
<p>A gallery wall creates a more collected, personal effect. It works well along stairways, in hallways, above a desk or on a wall that needs movement rather than one central focal point. Mix artwork with a shared thread: a similar colour palette, related subject matter, matching frames or a consistent level of contrast. Without one unifying element, a gallery wall can quickly feel like a collection of leftovers.</p>
<p>Lay out the arrangement on the floor first, or use paper templates on the wall to test the spacing. Keep gaps between frames relatively consistent. The art does not need to be symmetrical, but the overall shape should feel balanced.</p>
<h2>Select the finish that suits your home</h2>
<p>The format of your wall art affects the mood as much as the image itself. Canvas prints have a substantial, gallery-inspired presence and work especially well for abstract art, large-scale colour and pieces intended to anchor a room. Their softer, frameless finish can suit contemporary living spaces and bedrooms where you want warmth without visual clutter.</p>
<p>Posters offer a lighter, more flexible route. They are ideal for renters, first homes, offices and smaller walls, and they make it easy to refresh your look when your style evolves. A framed poster can look polished and structured, while an unframed format can feel more relaxed depending on the room.</p>
<p>Decorative wall pieces introduce texture and dimension, which can be valuable in spaces filled with smooth surfaces. If your room has flat-painted walls, streamlined furniture and minimal pattern, consider art with visible brushwork, layered forms or tactile materials. Texture adds interest even when the palette is quiet.</p>
<img src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80" alt="Minimal gallery wall in a modern home interior" class="w-full my-8 rounded-2xl shadow-sm" />
<h2>Use art to solve awkward walls</h2>
<p>Wall art is one of the quickest ways to make difficult areas feel designed rather than ignored. A narrow wall beside a doorway may suit a vertical print. A long corridor can take a series of related posters. Above a console table, a piece that echoes the table's width creates a satisfying, finished composition.</p>
<p>In rental spaces, art is also a practical way to shift the character of a room without changing permanent fixtures. If the paint colour, flooring or kitchen cabinetry is not your first choice, select artwork that introduces a palette you genuinely enjoy. The eye will naturally be drawn towards the art, making the space feel more like your own.</p>
<p>Do not feel obliged to fill every blank wall. A room needs resting space as well as focal points. Choose the walls that matter most when you enter, sit down or move through the home, then give those areas the attention they deserve.</p>
<h2>Let your taste lead the final choice</h2>
<p>Trends can offer useful direction, but the best wall art is artwork you will still want to look at after the room is finished. Choose images, shapes and colours that create a reaction, whether that is calm, curiosity, warmth or a little drama. A well-styled home should feel curated, not copied.</p>
<p>If you are deciding between two pieces, picture each one at the end of an ordinary day: lamps on, furniture in place and the room being lived in. The right choice is often the one that makes the space feel more complete without asking for attention every second. That is the quiet power of art chosen well.</p>
`,
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
    author: 'Archer & Ash',
    status: 'published',
    publishedAt: '2026-08-08T00:00:00.000Z',
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    _id: 'static-wall-art-size-guide',
    title: 'Wall Art Size Guide: Create Balanced Printed Art for Every Room',
    slug: 'wall-art-size-guide',
    excerpt: 'A practical wall art size guide for choosing prints, posters, and canvas pieces that feel balanced in every room.',
    content: `
<p>A beautiful print can still feel wrong if it is too small for the wall around it. This wall art size guide takes the guesswork out of choosing proportion, so your canvas prints, posters and decorative pieces feel considered rather than simply placed.</p>
<p>The aim is not to cover every inch of wall space. It is to create visual balance: enough scale to give the room a focal point, enough breathing room to keep the look calm, and a size that relates naturally to the furniture below it.</p>
<h2>Start with the furniture, not the empty wall</h2>
<p>When art hangs above a sofa, bed, sideboard or desk, that piece of furniture is your best sizing reference. A reliable rule is to choose artwork, or an arrangement of artworks, that spans around two-thirds to three-quarters of the furniture’s width.</p>
<p>For example, a 210 cm sofa looks most at home with wall art measuring roughly 140 to 160 cm wide in total. That could be one oversized canvas, a pair of complementary prints, or a composed gallery arrangement. A 50 cm print in the middle of that same sofa may be lovely on its own, but it will visually disappear once the room is furnished.</p>
<p>This proportion is a guide, not a rigid formula. A low, wide sideboard can support a broader artwork, while a tall upholstered headboard may call for a slightly narrower composition. What matters is that the art and furniture read as one intentional zone.</p>
<h2>Wall art size guide by room</h2>
<h3>Living room</h3>
<p>The living room is often where scale has the biggest impact. Above the sofa, larger is usually better. A single statement canvas gives a contemporary room a clean, confident focal point, particularly when the artwork has bold abstract shapes, organic texture or a strong colour story.</p>
<p>For a standard three-seat sofa, look towards one large piece around 100 x 150 cm, depending on the sofa’s width and the shape of the wall. Two pieces at 60 x 90 cm can create a balanced diptych, while three smaller works are effective when you want rhythm without the formality of one large rectangle.</p>
<p>Leave around 15 to 25 cm between the sofa and the bottom of the frame. If the artwork is much higher, the connection between furniture and wall starts to break. On an otherwise empty wall, give a hero piece room to breathe rather than surrounding it with extra décor just to fill space.</p>
<h3>Bedroom</h3>
<p>Above a bed, art should feel restful as well as well-proportioned. A landscape-oriented print is a natural choice above a headboard because it echoes the width of the bed. Aim for artwork that is roughly half to three-quarters of the bed’s width, measured from the outside edges rather than the mattress.</p>
<p>Above a double bed, a canvas around 90 x 120 cm or 100 x 150 cm often feels substantial without taking over. A pair of vertical prints can also frame the centreline neatly. Keep the bottom edge approximately 15 to 20 cm above the headboard, or slightly higher if you have a tall, upholstered design.</p>
<p>For a bedroom with no headboard, treat the bed and bedside tables as the full visual width. Art that is too narrow can make the wall feel oddly top-heavy, whereas a wider piece brings a softer, more finished sense of proportion.</p>
<h3>Dining room</h3>
<p>Dining spaces suit art with presence. A large canvas above a sideboard can anchor the room and make everyday meals feel a little more considered. Use the same two-thirds to three-quarters rule, based on the width of the sideboard.</p>
<p>If the wall is beside the dining table rather than above furniture, consider the table’s length and the viewing distance. A narrow dining room may benefit from one horizontal piece that draws the eye along the space. In a larger room, an oversized modern print can hold its own against a long table, pendant lighting and dining chairs.</p>
<h3>Hallway and entryway</h3>
<p>Hallways are ideal for adding personality, but their narrower proportions demand a little restraint. Choose vertical artwork on short walls or at the end of a corridor to create height. On a long, uninterrupted wall, a run of smaller frames can turn a pass-through into a gallery-like moment.</p>
<p>Avoid artworks that project too far from the wall in a tight hall. Slim framed posters and flatter canvas prints keep the route feeling open. If you are styling an entryway above a console table, use the furniture-width rule and hang the art low enough to feel connected to the surface.</p>
<h3>Home office</h3>
<p>Art above a desk has a quieter job: it should add character without making the work area feel crowded. One medium-sized print, typically around 50 x 70 cm or 60 x 90 cm, is often enough for a compact workspace. A wider desk can handle a larger horizontal canvas or two related pieces.</p>
<p>Choose artwork that supports the atmosphere you want to work in. Soft neutrals and calming abstracts feel composed, while colour-block designs or graphic posters can bring energy to a creative corner.</p>
<h2>How high should wall art hang?</h2>
<p>A useful starting point is to hang the centre of an artwork at around 145 cm from the floor. This places the piece close to average eye level and works well on a blank wall. In homes with particularly high ceilings, resist the temptation to push art upwards. Empty space above a frame can be elegant; art floating too close to the ceiling rarely is.</p>
<p>Above furniture, the gap below the artwork matters more than the centre measurement. Keep most pieces 15 to 25 cm above a sofa, bed, bench or sideboard. For a collection of frames, treat the whole arrangement as one artwork and measure from its overall centre.</p>
<p>Before making holes, use masking tape or sheets of paper cut to the size of your chosen piece. Step back, sit on the sofa, walk into the room and view the placement from the doorway. This quick test reveals whether the artwork needs more scale, a lower position or a different orientation.</p>
<h2>Choosing one large piece or a gallery wall</h2>
<p>A single large canvas is often the simplest answer to a broad blank wall. It creates an immediate focal point, makes a room feel more resolved and lets the artwork’s colour and texture do the work. This approach is especially effective in modern interiors where clean lines and fewer, stronger elements set the tone.</p>
<p>A gallery wall offers more flexibility. It can bring together abstract art, graphic posters and personal visual references, making it a good fit for staircases, hallways and spaces that need a more expressive layer. The trade-off is that it needs planning. Keep the gaps between frames consistent, usually around 5 to 8 cm, and map out the arrangement on the floor first.</p>
<p>For a polished gallery wall, choose one unifying element: a shared palette, matching frame finishes, a repeated print size or a similar art style. Variety creates interest, but too many unrelated visual directions can make the result feel busy rather than curated.</p>
<h2>Scale for tall ceilings and awkward walls</h2>
<p>Tall ceilings can make standard-sized art look undersized. Instead of hanging one small frame high on the wall, use larger vertical artwork, a stacked pair of prints or a salon-style grouping that occupies more of the wall’s central area. You do not need to fill the full height, but the composition should have enough presence to relate to the architecture.</p>
<p>For narrow wall sections between windows, doors or built-in shelving, work with the shape rather than against it. A vertical poster can turn an overlooked strip into a deliberate detail. On a small wall, one carefully chosen medium piece is usually stronger than several tiny frames competing for attention.</p>
<p>Renting does not change the principles of scale. It may influence how you hang your art, but a substantial print can still transform a flat more effectively than several undersized pieces. Consider lightweight canvas options or appropriate damage-free hanging methods where suitable for the wall and artwork.</p>
<h2>Let the artwork set the mood</h2>
<p>Size is only one part of the decision. The right artwork also picks up the room’s colour, mood and level of contrast. A large neutral canvas can bring softness to a busy living room, while a vivid contemporary print can give a pared-back bedroom the lift it needs.</p>
<p>If you are unsure between two sizes, choose the one that gives the room a clearer focal point. Well-scaled wall art does more than fill a gap: it makes the furniture, colours and personality already in the room feel like they belong together.</p>
<img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80" alt="Stylish living room with wall art above the sofa" class="w-full my-8 rounded-2xl shadow-sm" />
`,
    coverImage: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
    author: 'Archer & Ash',
    status: 'published',
    publishedAt: '2026-08-09T00:00:00.000Z',
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    _id: 'static-art-above-sofa-size-guide',
    title: 'Art Above Sofa Size Guide: How to Choose the Right Piece',
    slug: 'art-above-sofa-size-guide',
    excerpt: 'A practical guide to choosing art above a sofa with the right width, height and proportion for your living room.',
    content: `
<p>A sofa can be beautifully chosen and still feel unfinished when the wall behind it is left bare. The right artwork gives the seating area a visual anchor, brings your colours together and makes the whole room feel considered. This art above sofa size guide makes the proportions simple, whether you are styling a compact flat, a family living room or a generous open-plan space.</p>
<h2>The ideal width for art above a sofa</h2>
<p>The most reliable rule is to choose artwork, or a complete group of artworks, that measures around two-thirds to three-quarters of your sofa’s width. This creates enough presence to balance the furniture without making the wall feel crowded.</p>
<p>For example, a 180 cm sofa usually suits art with a total width of roughly 120 to 135 cm. Above a 210 cm sofa, look for a single oversized canvas or arrangement spanning about 140 to 160 cm. The measurement is based on the sofa itself, not the wall. A very wide wall can tempt you to fill every inch, but the sofa should remain the visual reference point.</p>
<p>A piece that is much narrower than half the sofa width often looks isolated, even when the artwork itself is striking. On the other hand, art that extends beyond the sofa can make the composition feel top-heavy. There are exceptions: a large-scale abstract canvas can work slightly wider in a minimal room, especially if the sofa has low arms and a simple silhouette. The overall effect should still feel calm rather than squeezed.</p>
<h3>A quick size reference</h3>
<p>Use these proportions as a useful starting point, then adjust for your ceiling height and the amount of surrounding furniture.</p>
<table>
<thead>
<tr>
<th>Sofa width</th>
<th>Ideal total art width</th>
<th>A considered choice</th>
</tr>
</thead>
<tbody><tr>
<td>150 cm</td>
<td>100 to 115 cm</td>
<td>One medium landscape canvas or two coordinated prints</td>
</tr>
<tr>
<td>180 cm</td>
<td>120 to 135 cm</td>
<td>One large canvas, a diptych or three framed posters</td>
</tr>
<tr>
<td>210 cm</td>
<td>140 to 160 cm</td>
<td>An oversized horizontal piece or a wide triptych</td>
</tr>
<tr>
<td>240 cm or more</td>
<td>160 to 180 cm</td>
<td>A substantial multi-panel display or statement canvas</td>
</tr>
</tbody></table>
<p>When shopping by inches, the same principle applies. A 72-inch sofa generally looks balanced with artwork measuring about 48 to 54 inches wide in total.</p>
<h2>How high should art hang above a sofa?</h2>
<p>Leave 15 to 20 cm between the top of the sofa and the bottom edge of the frame or canvas. This small gap helps the art and furniture read as one composed zone. Hang it much higher and the artwork can seem to float away from the room’s main seating area.</p>
<p>The familiar gallery rule of hanging art at eye level is helpful on an empty wall, but it needs adapting above furniture. If your sofa has a tall back, prioritise that 15 to 20 cm gap rather than forcing the centre of the art to a standard height. The aim is not a perfect number on the tape measure. It is a relationship that looks intentional when you are sitting, standing and entering the room.</p>
<p>If you have lofty ceilings, resist the urge to lift the artwork upwards to occupy more blank space. A taller canvas, a vertical pair or a gallery arrangement can add scale while keeping the lower edge connected to the sofa. This approach makes a high-ceilinged room feel warmer and more grounded.</p>
<h2>Choose one large piece or a grouped arrangement</h2>
<p>A single large canvas is often the easiest route to a polished result. It gives a room a confident focal point and lets colour, texture and movement speak clearly from across the space. Landscape artwork is particularly natural over a long sofa, while a wide abstract design can soften a clean-lined contemporary scheme.</p>
<p>A diptych or triptych offers a similarly tailored look with more rhythm. Treat the panels as one artwork when measuring their width. Keep the gaps consistent, usually around 5 to 8 cm, and include those gaps in the final span. Three 40 cm panels with 6 cm between each measure 132 cm overall, not 120 cm.</p>
<p>A gallery wall is a more expressive option for renters, collectors and anyone who prefers a layered home. It works best when it has a clear outer shape. Rather than scattering frames across the wall, plan the arrangement as though it sits inside an invisible rectangle that follows the two-thirds rule. A mix of modern art, graphic posters and softer tonal prints can feel personal, but repeat at least one element, such as frame colour, palette or print style, to keep it cohesive.</p>
<h3>When a vertical layout makes sense</h3>
<p>A tall, narrow piece above the middle of a wide sofa rarely provides enough visual weight on its own. It can work, however, alongside a floor lamp, shelving or a tall plant that intentionally fills one side of the composition. It can also suit a compact two-seater placed against a narrow wall.</p>
<p>For larger sofas, use vertical pieces in pairs or as part of a gallery wall. Their combined width and shared alignment will create the balance a single portrait-format print cannot achieve alone.</p>
<h2>Let the room influence the final size</h2>
<p>Proportion is the foundation, but your room’s character should shape the final decision. A low-profile sofa in a minimal, airy room can carry substantial artwork because there is less visual competition. A sofa with a high back, bold upholstery or patterned cushions may look better with art that has a little more breathing room.</p>
<p>Consider what sits beside the sofa, too. A large floor lamp or wide side table adds visual width, while a busy bookcase can make an already detailed gallery wall feel overdone. If the living room has several competing focal points, such as a fireplace, television and feature wallpaper, one calm statement canvas is often more effective than multiple small frames.</p>
<p>Colour also changes how large art feels. Light, tonal artwork can appear to recede, making it a good choice for a smaller room where you still want generous scale. Deep colours, high contrast and energetic abstract marks have more visual weight. They can make a modestly sized canvas feel more prominent, which is useful if you want drama without covering the entire wall.</p>
<h2>Mark it out before you commit</h2>
<p>Before hanging anything, use low-tack masking tape or sheets of paper to map the artwork’s outer dimensions on the wall. Step back to the opposite side of the room, then sit on the sofa and look again. This simple test reveals whether the piece needs more width, a lower position or a little more space at either side.</p>
<p>For a gallery wall, lay every frame on the floor first. Move the arrangement around until the spacing feels even, then photograph it before transferring the layout to the wall. Begin with the central piece, not the highest one, and work outwards. It is far easier to correct a position on the floor than after several holes have been made.</p>
<p>If you are decorating a rental, check the weight and fixing requirements of your chosen canvas or framed poster before choosing a hanging method. A lightweight print may suit removable fixings, while larger statement pieces deserve secure wall hardware. Good placement should never come at the expense of a safe installation.</p>
<h2>Common proportion mistakes to avoid</h2>
<p>The most common mistake is choosing art because it looks good on its own, rather than because it works with the sofa beneath it. A beautiful small print can get lost above a three-seater, just as an enormous dark canvas can overwhelm a delicate loveseat. Think of the artwork and sofa as one composition, not two separate purchases.</p>
<p>Another is treating several small pictures as though each needs its own space. When grouped tightly and arranged within one shared outline, smaller prints become a purposeful focal point. When spread too far apart, they create visual clutter instead.</p>
<p>Finally, do not overlook the space beneath the artwork. Cushions, throws and a coffee table can echo colours or shapes from the art without matching exactly. That subtle repetition is what makes a living room feel styled rather than simply furnished.</p>
<p>The best piece above your sofa is not necessarily the largest one you can fit. It is the one that gives the seating area presence, reflects your point of view and makes you glad to look up when you settle in at the end of the day.</p>
`,
    coverImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
    author: 'Archer & Ash',
    status: 'published',
    publishedAt: '2026-08-10T00:00:00.000Z',
    createdAt: '2026-08-10T00:00:00.000Z',
    updatedAt: '2026-08-10T00:00:00.000Z',
  },
];

export function getStaticInspirationPosts(): InspirationPost[] {
  return staticInspirationPosts.map((post) => ({ ...post }));
}

export function getStaticInspirationPostBySlug(slug: string): InspirationPost | null {
  return staticInspirationPosts.find((post) => post.slug === slug) || null;
}
