import Avatar from "./Avatar.jsx";
import Rating from "./Rating.jsx";

export default function ReviewCard({ review }) {
  return (
    <div className="border-b border-steeldim py-5 flex gap-4">
      <Avatar name={review.user?.name} src={review.user?.avatar} size={40} />
      <div className="flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <span className="font-semibold text-sm">{review.user?.name || "Anonymous"}</span>
          <span className="text-[11px] font-mono text-steel">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Rating value={review.rating} />
        {review.title && <div className="font-semibold text-sm mt-2">{review.title}</div>}
        <p className="text-sm text-steel mt-1 leading-relaxed">{review.comment}</p>
      </div>
    </div>
  );
}
