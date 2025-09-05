export default function Pill({label, active, onClick}) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 rounded-full border text-sm transition shadow-sm ${
                active ? "bg-black text-white border-black" : "bg-white hover:bg-neutral-50"
            }`}
        >
            {label}
        </button>
    );
}
