export default function Timeline() {
    return (<ol className="relative border-l pl-6">
            {[{
                title: "c. 2100 BCE - Enkidu in the Epic of Gilgamesh (Mesopotamia)", text: "Earliest literary Wild Man; tamed by contact with civilisation.",
            }, {
                title: "Classical era - Pan, Satyrs, Silvanus/Faunus (Greece/Rome)", text: "Goat-footed and rustic deities of the wild, fertility, and boundary spaces.",
            }, {
                title: "Early medieval - Woodwose / Wuduwasa (Germanic/Anglo-Saxon)", text: "Hairy forest-dweller in art and text, bearing a club.",
            }, {
                title: "11th-16th c. - Green Man foliate heads (Europe)", text: "Leafy faces carved in churches; symbol of cycles and renewal.",
            }, {
                title: "Medieval to modern - Leshy, Yeti, Almas, Mao Ren", text: "Parallel Eurasian wild-beings spanning Slavic forests to Himalayan peaks.",
            }, {
                title: "Pre-contact to modern - Wendigo, Sasquatch, Mapinguari, Curupira, Yowie", text: "Indigenous American and Aboriginal Australian figures reflecting moral law and guardianship of wild places.",
            },].map((e, i) => (<li key={i} className="mb-6">
                    <div className="absolute -left-2 top-1 h-4 w-4 rounded-full border bg-white"></div>
                    <h4 className="font-semibold">{e.title}</h4>
                    <p className="text-sm text-neutral-700">{e.text}</p>
                </li>))}
        </ol>);
}
