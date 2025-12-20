import "./FoodCard.css";

/**
 * Componente FoodCard - Tarjeta de plato destacado
 */
const FoodCard = ({ food, onClick }) => {
  return (
    <div className="food-card" onClick={onClick}>
      <div className="food-image-container">
        <img
          src={food.image}
          alt={food.name}
          className="food-image"
          loading="lazy"
        />
        {food.tags && food.tags.length > 0 && (
          <div className="food-tags">
            {food.tags.map((tag, index) => (
              <span key={index} className="food-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="food-content">
        <h3 className="food-name">{food.name}</h3>
        <p className="food-description">{food.description}</p>
      </div>
    </div>
  );
};

export default FoodCard;
